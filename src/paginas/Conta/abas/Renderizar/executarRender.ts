import { gerarCatalogo, gerarImagem } from "../../../../servicos/servicoGoogleIA";
import { normalizarParametros } from "./utilitarios/normalizarParametros";
import { detectarPedidoPessoa } from "./utilitarios/detectarPedidoPessoa";
import { mapearErroGoogleIA, type ErroGoogleIA } from "./utilitarios/mapearErroGoogleIA";
import { montarPromptCatalogo } from "./prompts/catalogoForense";
import { buildProjectContext, buildTaskText, buildUserCustomization } from "./prompts/montarTaskText";
import { montarSystemDoModelo } from "./prompts/systemPromptRender";
import { anexarBlocosFinais } from "./prompts/anexosFinais";
import { montarPartesRender } from "./prompts/montarPartesRender";
import type { InfoImagemRender, ParametrosRender, ResultadoRender } from "./tipos";

export interface ResultadoExecucaoRender {
  sucesso: boolean;
  resultado?: ResultadoRender;
  erro?: ErroGoogleIA;
}

// Orquestra as 3 etapas da seção 1: catálogo forense (texto) → montagem do
// prompt final → geração da imagem (com fallback de modelo embutido em
// gerarImagem). Cada etapa usa o "modelo ativo" pra decidir system/parts —
// por isso a montagem final só acontece dentro do callback "montar" do
// gerarImagem, que é chamado de novo se o fallback entrar em ação.
export async function executarRender(
  chave: string,
  imagem: InfoImagemRender,
  parametrosBrutos: ParametrosRender,
  aoMudarEtapa: (etapa: "catalogo" | "render") => void
): Promise<ResultadoExecucaoRender> {
  const parametros = normalizarParametros(parametrosBrutos);

  aoMudarEtapa("catalogo");
  const promptCatalogo = montarPromptCatalogo(parametros);
  const catalogo = await gerarCatalogo(chave, imagem.base64Png, promptCatalogo);

  if (!catalogo.texto) {
    const erro =
      catalogo.status >= 200 && catalogo.status < 300
        ? { chave: "conta.renderizar.erros.catalogoVazio" }
        : mapearErroGoogleIA(catalogo.status, catalogo.corpo);
    return { sucesso: false, erro };
  }

  aoMudarEtapa("render");

  const projectContext = buildProjectContext(parametros);
  const taskText = buildTaskText(catalogo.texto, projectContext);
  const userCustomization = buildUserCustomization(parametros.prompt);
  const temPedidoPessoa = detectarPedidoPessoa(parametros.prompt);

  const resultado = await gerarImagem(chave, {
    modeloIa: parametros.modeloIa,
    qualidade: parametros.qualidade,
    proporcao: parametros.proporcao,
    montar: (modelo) => {
      const ehFlash = modelo.includes("flash") || modelo.includes("3.1");
      const systemBase = montarSystemDoModelo(parametros, modelo);
      const system = anexarBlocosFinais(systemBase, parametros);
      const parts = montarPartesRender(taskText, imagem.base64Png, userCustomization, ehFlash, parametros.temperatura);
      return { system, parts, temPedidoPessoa };
    },
  });

  if (!resultado.imagemBase64) {
    const finishReason = resultado.corpo.candidates?.[0]?.finishReason ?? "desconhecido";
    if (resultado.status >= 200 && resultado.status < 300) {
      return { sucesso: false, erro: { chave: "conta.renderizar.erros.semImagem", parametros: { motivo: finishReason } } };
    }
    return { sucesso: false, erro: mapearErroGoogleIA(resultado.status, resultado.corpo) };
  }

  return {
    sucesso: true,
    resultado: {
      imagemBase64: resultado.imagemBase64,
      mimeType: resultado.mimeType,
      larguraReal: resultado.largura ?? imagem.largura,
      alturaReal: resultado.altura ?? imagem.altura,
      avisoResolucao: resultado.avisoResolucao,
      avisoFallback: resultado.avisoFallback,
    },
  };
}
