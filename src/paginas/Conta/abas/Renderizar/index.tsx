import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ConfiguracaoChaveGoogleIA from "./componentes/ConfiguracaoChaveGoogleIA";
import UploadImagemRender from "./componentes/UploadImagemRender";
import PainelParametrosRender from "./componentes/PainelParametrosRender";
import PainelResultadoRender from "./componentes/PainelResultadoRender";
import { prepararImagemRender, arquivoEhImagemSuportada } from "./utilitarios/prepararImagemRender";
import { obterChaveGoogleIA, removerChaveGoogleIA } from "./utilitarios/armazenamentoRenderizar";
import { PARAMETROS_PADRAO } from "./dados/opcoesRenderizacao";
import { executarRender } from "./executarRender";
import { executarRefinamento } from "./executarRefinamento";
import type { EstadoRender, ParametrosRender } from "./tipos";

function EstadoCarregando({ texto }: { texto: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-4 rounded-quadro border border-borda bg-fundo-elevado px-6 py-16 sm:py-24"
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-9 w-9 rounded-full border-2 border-borda border-t-marca"
        aria-hidden="true"
      />
      <p className="text-sm text-texto-secundario">{texto}</p>
    </motion.div>
  );
}

export default function AbaRenderizar() {
  const { t } = useTranslation();
  const [chave, definirChave] = useState<string | null>(() => obterChaveGoogleIA());
  const [estado, definirEstado] = useState<EstadoRender>({ fase: "sem-imagem" });
  const [erroRefinamento, setErroRefinamento] = useState<string | null>(null);

  const canceladoRef = useRef(false);
  // Guarda o arquivo original (não só a versão já cortada) pra poder refazer
  // o crop central do zero sempre que a proporção mudar — o corte depende
  // diretamente dela, então reaproveitar o corte antigo produziria uma
  // imagem cuja moldura não bate mais com a proporção declarada à IA.
  const arquivoOriginalRef = useRef<File | null>(null);

  useEffect(() => {
    canceladoRef.current = false;
    return () => {
      canceladoRef.current = true;
    };
  }, []);

  const aoConfigurarChave = useCallback((novaChave: string) => {
    definirChave(novaChave);
  }, []);

  const aoAlterarChave = useCallback(() => {
    removerChaveGoogleIA();
    definirChave(null);
  }, []);

  const aoSelecionarArquivo = useCallback(
    async (arquivo: File) => {
      definirEstado({ fase: "carregando-imagem" });

      if (!arquivoEhImagemSuportada(arquivo)) {
        definirEstado({ fase: "erro", mensagem: t("conta.renderizar.erros.tipoInvalido") });
        return;
      }

      try {
        const parametros = { ...PARAMETROS_PADRAO };
        arquivoOriginalRef.current = arquivo;
        const imagem = await prepararImagemRender(arquivo, parametros.proporcao);
        if (canceladoRef.current) return;
        definirEstado({ fase: "configurando", imagem, parametros });
      } catch {
        if (!canceladoRef.current) {
          definirEstado({ fase: "erro", mensagem: t("conta.renderizar.erros.leituraFalhou") });
        }
      }
    },
    [t]
  );

  const aoTrocarImagem = useCallback(() => {
    setErroRefinamento(null);
    definirEstado({ fase: "sem-imagem" });
  }, []);

  const aoMudarParametros = useCallback(
    async (novosParametros: ParametrosRender) => {
      if (estado.fase !== "configurando" && estado.fase !== "erro") return;
      if (!estado.imagem || !estado.parametros) return;

      const proporcaoMudou = novosParametros.proporcao !== estado.parametros.proporcao;
      const arquivoOriginal = arquivoOriginalRef.current;

      if (proporcaoMudou && arquivoOriginal) {
        try {
          const imagem = await prepararImagemRender(arquivoOriginal, novosParametros.proporcao);
          if (canceladoRef.current) return;
          definirEstado({ fase: "configurando", imagem, parametros: novosParametros });
          return;
        } catch {
          // Se o recorte falhar por algum motivo, segue com a imagem antiga
          // em vez de travar a troca de parâmetro inteira.
        }
      }

      definirEstado({ fase: "configurando", imagem: estado.imagem, parametros: novosParametros });
    },
    [estado]
  );

  const aoGerar = useCallback(async () => {
    if (estado.fase !== "configurando" || !chave) return;
    const { imagem, parametros } = estado;

    definirEstado({ fase: "gerando", imagem, parametros, etapa: "catalogo" });

    const resultadoExecucao = await executarRender(chave, imagem, parametros, (etapa) => {
      if (canceladoRef.current) return;
      definirEstado({ fase: "gerando", imagem, parametros, etapa });
    });

    if (canceladoRef.current) return;

    if (!resultadoExecucao.sucesso || !resultadoExecucao.resultado) {
      const mensagem = resultadoExecucao.erro
        ? t(resultadoExecucao.erro.chave, resultadoExecucao.erro.parametros)
        : t("conta.renderizar.erros.erroGenerico");
      definirEstado({ fase: "erro", mensagem, imagem, parametros });
      return;
    }

    definirEstado({ fase: "pronto", imagem, resultado: resultadoExecucao.resultado, parametros });
  }, [estado, chave, t]);

  const aoRefinar = useCallback(
    async (promptRefinamento: string) => {
      if (estado.fase !== "pronto" || !chave) return;
      const { imagem, resultado, parametros } = estado;

      setErroRefinamento(null);
      definirEstado({ fase: "gerando", imagem, parametros, etapa: "refinamento" });

      const resultadoExecucao = await executarRefinamento(
        chave,
        resultado.imagemBase64,
        promptRefinamento,
        parametros.modeloIa,
        parametros.qualidade,
        parametros.proporcao
      );

      if (canceladoRef.current) return;

      if (!resultadoExecucao.sucesso || !resultadoExecucao.resultado) {
        const mensagem = resultadoExecucao.erro
          ? t(resultadoExecucao.erro.chave, resultadoExecucao.erro.parametros)
          : t("conta.renderizar.erros.erroGenerico");
        setErroRefinamento(mensagem);
        definirEstado({ fase: "pronto", imagem, resultado, parametros });
        return;
      }

      definirEstado({ fase: "pronto", imagem, resultado: resultadoExecucao.resultado, parametros });
    },
    [estado, chave, t]
  );

  const emRefinamento = estado.fase === "gerando" && estado.etapa === "refinamento";

  const imagemAtual =
    (estado.fase === "configurando" || estado.fase === "gerando") && !emRefinamento
      ? estado.imagem
      : estado.fase === "erro" && estado.imagem
        ? estado.imagem
        : null;

  const parametrosAtuais =
    (estado.fase === "configurando" || estado.fase === "gerando") && !emRefinamento
      ? estado.parametros
      : estado.fase === "erro" && estado.parametros
        ? estado.parametros
        : null;

  const emGeracao = estado.fase === "gerando" && !emRefinamento;
  const etapaGeracao = estado.fase === "gerando" ? estado.etapa : null;
  const mensagemErroPainel = estado.fase === "erro" && estado.imagem ? estado.mensagem : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-4 text-center sm:text-left">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-titulo text-3xl font-bold tracking-tight text-texto-primario sm:text-4xl"
          >
            {t("conta.renderizar.titulo")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-3 max-w-md text-sm leading-relaxed text-texto-secundario"
          >
            {t("conta.renderizar.descricao")}
          </motion.p>
        </div>

        {chave && (
          <button
            type="button"
            onClick={aoAlterarChave}
            disabled={emGeracao}
            className="shrink-0 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            {t("conta.renderizar.chave.botaoRemover")}
          </button>
        )}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {estado.fase === "carregando-imagem" && (
            <EstadoCarregando key="carregando" texto={t("conta.renderizar.carregandoImagem")} />
          )}

          {!imagemAtual && (estado.fase === "sem-imagem" || estado.fase === "erro") && (
            <UploadImagemRender
              key="upload"
              aoSelecionarArquivo={aoSelecionarArquivo}
              erro={estado.fase === "erro" ? estado.mensagem : null}
            />
          )}

          {emRefinamento && (
            <EstadoCarregando key="refinando" texto={t("conta.renderizar.refinar.aplicando")} />
          )}

          {imagemAtual && parametrosAtuais && (
            <motion.div key="painel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {mensagemErroPainel && <p className="mb-4 text-center text-sm text-erro">{mensagemErroPainel}</p>}

              {!chave ? (
                <ConfiguracaoChaveGoogleIA aoConfigurada={aoConfigurarChave} />
              ) : (
                <PainelParametrosRender
                  imagem={imagemAtual}
                  parametros={parametrosAtuais}
                  aoMudarParametros={aoMudarParametros}
                  aoGerar={aoGerar}
                  aoTrocarImagem={aoTrocarImagem}
                  gerando={emGeracao}
                  etapa={etapaGeracao}
                />
              )}
            </motion.div>
          )}

          {estado.fase === "pronto" && (
            <motion.div key="pronto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {erroRefinamento && <p className="mb-4 text-center text-sm text-erro">{erroRefinamento}</p>}
              <PainelResultadoRender
                dataUrl={`data:${estado.resultado.mimeType};base64,${estado.resultado.imagemBase64}`}
                avisos={[estado.resultado.avisoFallback, estado.resultado.avisoResolucao].filter(
                  (aviso): aviso is string => Boolean(aviso)
                )}
                aoRefinar={aoRefinar}
                aoGerarOutro={aoTrocarImagem}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
