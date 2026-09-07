import { gerarImagem } from "../../../../servicos/servicoGoogleIA";
import { mapearErroGoogleIA, type ErroGoogleIA } from "./utilitarios/mapearErroGoogleIA";
import { montarPromptRefinamento, montarPartesRefinamento } from "./prompts/refinamento";
import type { ModeloIA, Proporcao, Qualidade, ResultadoRender } from "./tipos";

export interface ResultadoExecucaoRefinamento {
  sucesso: boolean;
  resultado?: ResultadoRender;
  erro?: ErroGoogleIA;
}

// Seção 9 — pula a etapa de catálogo, edita a imagem já renderizada
// (resultado atual) direto a partir de uma instrução do usuário.
export async function executarRefinamento(
  chave: string,
  imagemAtualBase64: string,
  prompt: string,
  modeloIa: ModeloIA,
  qualidade: Qualidade,
  proporcao: Proporcao,
  referenciaBase64?: string
): Promise<ResultadoExecucaoRefinamento> {
  const { system, textoFinal, pedePessoa } = montarPromptRefinamento(prompt);

  const resultado = await gerarImagem(chave, {
    modeloIa,
    qualidade,
    proporcao,
    montar: () => ({
      system,
      parts: montarPartesRefinamento(imagemAtualBase64, textoFinal, referenciaBase64),
      temPedidoPessoa: pedePessoa,
    }),
  });

  if (!resultado.imagemBase64) {
    if (resultado.status >= 200 && resultado.status < 300) {
      return { sucesso: false, erro: { chave: "conta.renderizar.erros.semImagem" } };
    }
    return { sucesso: false, erro: mapearErroGoogleIA(resultado.status, resultado.corpo) };
  }

  return {
    sucesso: true,
    resultado: {
      imagemBase64: resultado.imagemBase64,
      mimeType: resultado.mimeType,
      larguraReal: resultado.largura ?? 0,
      alturaReal: resultado.altura ?? 0,
      avisoResolucao: resultado.avisoResolucao,
      avisoFallback: resultado.avisoFallback,
    },
  };
}
