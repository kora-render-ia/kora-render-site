import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ConfiguracaoChaveRunway from "./componentes/ConfiguracaoChaveRunway";
import UploadImagemVideo from "./componentes/UploadImagemVideo";
import PainelGeracaoVideo from "./componentes/PainelGeracaoVideo";
import ReprodutorVideoGerado from "./componentes/ReprodutorVideoGerado";
import HistoricoVideos from "./componentes/HistoricoVideos";
import { prepararImagemVideo, arquivoEhImagemSuportada } from "./utilitarios/prepararImagemVideo";
import { escolherProporcaoVideo } from "./utilitarios/escolherProporcaoVideo";
import { montarPromptVideo } from "./utilitarios/montarPromptVideo";
import { mapearErroRunway, classificarStatusRunway } from "./utilitarios/mapearErroRunway";
import {
  obterChaveRunway,
  removerChaveRunway,
  obterHistoricoVideos,
  adicionarAoHistoricoVideos,
  removerDoHistoricoVideos,
} from "./utilitarios/armazenamentoVideo";
import { catalogoPillsMovimento } from "./dados/catalogoPillsMovimento";
import { servicoRunway } from "../../../../servicos/servicoRunway";
import type { EstadoVideo, InfoImagemVideo, ItemHistoricoVideo } from "./tipos";

const INTERVALO_POLLING_MS = 4000;
const TENTATIVAS_MAXIMAS = 150;

function gerarIdHistorico(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

export default function AbaVideos() {
  const { t } = useTranslation();
  const [chave, definirChave] = useState<string | null>(() => obterChaveRunway());
  const [estado, definirEstado] = useState<EstadoVideo>(() =>
    obterChaveRunway() ? { fase: "sem-imagem" } : { fase: "sem-chave" }
  );
  const [pillsSelecionadas, setPillsSelecionadas] = useState<string[]>([]);
  const [textoLivre, setTextoLivre] = useState("");
  const [duracao, setDuracao] = useState<5 | 10>(5);
  const [historico, setHistorico] = useState<ItemHistoricoVideo[]>(() => obterHistoricoVideos());

  const canceladoRef = useRef(false);
  useEffect(() => {
    // Reseta no setup (necessário porque o StrictMode do React monta,
    // desmonta e remonta uma vez em dev — sem isso, o cleanup do primeiro
    // ciclo deixava esta ref travada em "true" para sempre).
    canceladoRef.current = false;
    return () => {
      canceladoRef.current = true;
    };
  }, []);

  const aoConfigurarChave = useCallback((novaChave: string) => {
    definirChave(novaChave);
    definirEstado({ fase: "sem-imagem" });
  }, []);

  const aoAlterarChave = useCallback(() => {
    removerChaveRunway();
    definirChave(null);
    definirEstado({ fase: "sem-chave" });
  }, []);

  const aoSelecionarArquivo = useCallback(
    async (arquivo: File) => {
      definirEstado({ fase: "carregando-imagem" });

      if (!arquivoEhImagemSuportada(arquivo)) {
        definirEstado({
          fase: "erro",
          mensagem: t("conta.videos.erros.tipoInvalido"),
          faseAnterior: "sem-imagem",
        });
        return;
      }

      try {
        const { dataUrl, largura, altura } = await prepararImagemVideo(arquivo);
        const ratio = escolherProporcaoVideo(largura, altura);
        definirEstado({
          fase: "configurando",
          imagem: { dataUrl, nomeArquivo: arquivo.name, largura, altura, ratio },
        });
      } catch {
        definirEstado({
          fase: "erro",
          mensagem: t("conta.videos.erros.leituraFalhou"),
          faseAnterior: "sem-imagem",
        });
      }
    },
    [t]
  );

  const aoAlternarPill = useCallback((id: string) => {
    setPillsSelecionadas((atual) => (atual.includes(id) ? atual.filter((p) => p !== id) : [...atual, id]));
  }, []);

  const aoTrocarImagem = useCallback(() => {
    setPillsSelecionadas([]);
    setTextoLivre("");
    definirEstado({ fase: "sem-imagem" });
  }, []);

  const aoRemoverHistoricoItem = useCallback((id: string) => {
    setHistorico(removerDoHistoricoVideos(id));
  }, []);

  function executarPolling(
    chaveAtual: string,
    imagem: InfoImagemVideo,
    taskId: string,
    promptFinal: string,
    tentativa: number
  ) {
    if (tentativa >= TENTATIVAS_MAXIMAS) {
      definirEstado({
        fase: "erro",
        mensagem: t("conta.videos.erros.timeoutPolling"),
        faseAnterior: "gerando",
        imagem,
      });
      return;
    }

    setTimeout(async () => {
      if (canceladoRef.current) return;

      const { status, corpo } = await servicoRunway.consultarStatus(chaveAtual, taskId);
      if (canceladoRef.current) return;

      if (status !== 200) {
        definirEstado({ fase: "erro", mensagem: t(mapearErroRunway(status, corpo)), faseAnterior: "gerando", imagem });
        return;
      }

      const resultado = classificarStatusRunway(corpo.status);

      if (resultado === "em_andamento") {
        const proximaTentativa = tentativa + 1;
        definirEstado({ fase: "gerando", imagem, taskId, tentativa: proximaTentativa });
        executarPolling(chaveAtual, imagem, taskId, promptFinal, proximaTentativa);
        return;
      }

      if (resultado === "falha") {
        definirEstado({
          fase: "erro",
          mensagem: t("conta.videos.erros.geracaoFalhou"),
          faseAnterior: "gerando",
          imagem,
        });
        return;
      }

      const urlVideo = corpo.output?.[0];
      if (!urlVideo) {
        definirEstado({
          fase: "erro",
          mensagem: t("conta.videos.erros.erroGenerico"),
          faseAnterior: "gerando",
          imagem,
        });
        return;
      }

      setHistorico(
        adicionarAoHistoricoVideos({
          id: gerarIdHistorico(),
          urlVideo,
          prompt: promptFinal,
          duracao,
          criadoEm: new Date().toISOString(),
        })
      );
      definirEstado({ fase: "pronto", imagem, urlVideo });
    }, INTERVALO_POLLING_MS);
  }

  const aoGerar = useCallback(async () => {
    if (estado.fase !== "configurando" || !chave) return;
    const { imagem } = estado;
    const pillsCompletas = catalogoPillsMovimento
      .flatMap((grupo) => grupo.pills)
      .filter((pill) => pillsSelecionadas.includes(pill.id));
    const promptFinal = montarPromptVideo(textoLivre, pillsCompletas);

    definirEstado({ fase: "gerando", imagem, taskId: "", tentativa: 0 });

    const { status, corpo } = await servicoRunway.criarTarefa({
      apiKey: chave,
      promptImage: imagem.dataUrl,
      promptText: promptFinal,
      ratio: imagem.ratio,
      duration: duracao,
    });

    if (canceladoRef.current) return;

    if (status !== 200 || !corpo.id) {
      definirEstado({
        fase: "erro",
        mensagem: t(mapearErroRunway(status, corpo)),
        faseAnterior: "configurando",
        imagem,
      });
      return;
    }

    definirEstado({ fase: "gerando", imagem, taskId: corpo.id, tentativa: 0 });
    executarPolling(chave, imagem, corpo.id, promptFinal, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, chave, textoLivre, pillsSelecionadas, duracao, t]);

  const imagemAtual: InfoImagemVideo | null =
    estado.fase === "configurando" || estado.fase === "gerando"
      ? estado.imagem
      : estado.fase === "erro" && estado.imagem
        ? estado.imagem
        : null;
  const emGeracao = estado.fase === "gerando";
  const tentativaAtual = estado.fase === "gerando" ? estado.tentativa : 0;
  const mensagemErroPainel = estado.fase === "erro" && estado.imagem ? estado.mensagem : null;
  const mostrarHistorico = chave !== null && (estado.fase === "sem-imagem" || estado.fase === "pronto");

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
            {t("conta.videos.titulo")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-3 max-w-md text-sm leading-relaxed text-texto-secundario"
          >
            {t("conta.videos.descricao")}
          </motion.p>
        </div>

        {chave && (
          <button
            type="button"
            onClick={aoAlterarChave}
            disabled={emGeracao}
            className="shrink-0 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            {t("conta.videos.chave.botaoRemover")}
          </button>
        )}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {estado.fase === "sem-chave" && (
            <ConfiguracaoChaveRunway key="chave" aoConfigurada={aoConfigurarChave} />
          )}

          {estado.fase === "carregando-imagem" && (
            <EstadoCarregando key="carregando" texto={t("conta.videos.carregandoImagem")} />
          )}

          {!imagemAtual && (estado.fase === "sem-imagem" || estado.fase === "erro") && (
            <UploadImagemVideo
              key="upload"
              aoSelecionarArquivo={aoSelecionarArquivo}
              erro={estado.fase === "erro" ? estado.mensagem : null}
            />
          )}

          {imagemAtual && (
            <motion.div
              key="painel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {mensagemErroPainel && (
                <p className="mb-4 text-center text-sm text-erro">{mensagemErroPainel}</p>
              )}
              <PainelGeracaoVideo
                imagem={imagemAtual}
                pillsSelecionadas={pillsSelecionadas}
                aoAlternarPill={aoAlternarPill}
                textoLivre={textoLivre}
                aoMudarTexto={setTextoLivre}
                duracao={duracao}
                aoMudarDuracao={setDuracao}
                aoGerar={aoGerar}
                aoTrocarImagem={aoTrocarImagem}
                gerando={emGeracao}
                tentativa={tentativaAtual}
              />
            </motion.div>
          )}

          {estado.fase === "pronto" && (
            <ReprodutorVideoGerado key="pronto" urlVideo={estado.urlVideo} aoGerarOutro={aoTrocarImagem} />
          )}
        </AnimatePresence>
      </div>

      {mostrarHistorico && <HistoricoVideos itens={historico} aoRemover={aoRemoverHistoricoItem} />}
    </div>
  );
}
