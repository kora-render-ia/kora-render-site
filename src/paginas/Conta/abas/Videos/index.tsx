import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SeletorModoGeracao from "./componentes/SeletorModoGeracao";
import ConfiguracaoChaveVideoIA from "./componentes/ConfiguracaoChaveVideoIA";
import UploadImagemVideo from "./componentes/UploadImagemVideo";
import PainelGeracaoVideo from "./componentes/PainelGeracaoVideo";
import PainelParallaxCamera from "./componentes/PainelParallaxCamera";
import ReprodutorVideoGerado from "./componentes/ReprodutorVideoGerado";
import HistoricoVideos from "./componentes/HistoricoVideos";
import { prepararImagemVideo, arquivoEhImagemSuportada } from "./utilitarios/prepararImagemVideo";
import { montarPromptVideo } from "./utilitarios/montarPromptVideo";
import { mapearErroVideoIA, classificarStatusFal } from "./utilitarios/mapearErroVideoIA";
import {
  obterChaveVideoIA,
  removerChaveVideoIA,
  obterHistoricoVideos,
  adicionarAoHistoricoVideos,
  removerDoHistoricoVideos,
} from "./utilitarios/armazenamentoVideo";
import { catalogoPillsAmbiente } from "./dados/catalogoPillsMovimento";
import { servicoVideoIA } from "../../../../servicos/servicoVideoIA";
import { capturarVideoParallax, gravacaoDeVideoSuportada } from "./parallax/capturarVideoParallax";
import type { EstadoVideo, IdMovimentoCamera, ItemHistoricoVideo, ModoGeracao } from "./tipos";

const INTERVALO_POLLING_MS = 4000;
const TENTATIVAS_MAXIMAS = 150;
const RESOLUCAO_PARALLAX_MAXIMA = 960;

function respostaComSucesso(status: number): boolean {
  return status >= 200 && status < 300;
}

function gerarIdHistorico(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function carregarComoImagem(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () => reject(new Error("falha_leitura"));
    imagem.src = dataUrl;
  });
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
  const [chave, definirChave] = useState<string | null>(() => obterChaveVideoIA());
  const [modoAtivo, definirModoAtivo] = useState<ModoGeracao>("camera");
  const [estado, definirEstado] = useState<EstadoVideo>({ fase: "sem-imagem" });
  const [pillsSelecionadas, setPillsSelecionadas] = useState<string[]>([]);
  const [textoLivre, setTextoLivre] = useState("");
  const [duracao, setDuracao] = useState<5 | 10>(5);
  const [movimentoCamera, setMovimentoCamera] = useState<IdMovimentoCamera>("zoom-in");
  const [historico, setHistorico] = useState<ItemHistoricoVideo[]>(() => obterHistoricoVideos());

  const canceladoRef = useRef(false);
  const urlLocalAtualRef = useRef<string | null>(null);

  useEffect(() => {
    // Reseta no setup (StrictMode monta/desmonta/remonta uma vez em dev — sem
    // isso, o cleanup do primeiro ciclo travaria esta ref em "true" pra sempre).
    canceladoRef.current = false;
    return () => {
      canceladoRef.current = true;
      if (urlLocalAtualRef.current) URL.revokeObjectURL(urlLocalAtualRef.current);
    };
  }, []);

  const aoConfigurarChave = useCallback((novaChave: string) => {
    definirChave(novaChave);
  }, []);

  const aoAlterarChave = useCallback(() => {
    removerChaveVideoIA();
    definirChave(null);
  }, []);

  const aoSelecionarArquivo = useCallback(
    async (arquivo: File) => {
      definirEstado({ fase: "carregando-imagem" });

      if (!arquivoEhImagemSuportada(arquivo)) {
        definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.tipoInvalido") });
        return;
      }

      try {
        const { dataUrl, blob, largura, altura } = await prepararImagemVideo(arquivo);
        definirEstado({
          fase: "configurando",
          imagem: { dataUrl, blob, nomeArquivo: arquivo.name, largura, altura },
        });
      } catch {
        definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.leituraFalhou") });
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
    setMovimentoCamera("zoom-in");
    if (urlLocalAtualRef.current) {
      URL.revokeObjectURL(urlLocalAtualRef.current);
      urlLocalAtualRef.current = null;
    }
    definirEstado({ fase: "sem-imagem" });
  }, []);

  const aoRemoverHistoricoItem = useCallback((id: string) => {
    setHistorico(removerDoHistoricoVideos(id));
  }, []);

  function executarPollingIA(
    chaveAtual: string,
    imagem: Extract<EstadoVideo, { fase: "configurando" }>["imagem"],
    statusUrl: string,
    responseUrl: string,
    promptFinal: string,
    tentativa: number
  ) {
    if (tentativa >= TENTATIVAS_MAXIMAS) {
      definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.timeoutPolling"), imagem });
      return;
    }

    setTimeout(async () => {
      if (canceladoRef.current) return;

      const { status, corpo } = await servicoVideoIA.consultarStatus(chaveAtual, statusUrl);
      if (canceladoRef.current) return;

      if (!respostaComSucesso(status)) {
        definirEstado({ fase: "erro", mensagem: t(mapearErroVideoIA(status, corpo)), imagem });
        return;
      }

      const resultado = classificarStatusFal(corpo.status);

      if (resultado === "em_andamento") {
        const proximaTentativa = tentativa + 1;
        definirEstado({ fase: "gerando-ia", imagem, taskId: statusUrl, tentativa: proximaTentativa });
        executarPollingIA(chaveAtual, imagem, statusUrl, responseUrl, promptFinal, proximaTentativa);
        return;
      }

      if (resultado === "falha") {
        definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.geracaoFalhou"), imagem });
        return;
      }

      const resultadoFinal = await servicoVideoIA.obterResultado(chaveAtual, responseUrl);
      if (canceladoRef.current) return;

      const urlVideo = resultadoFinal.corpo.video?.url;
      if (!respostaComSucesso(resultadoFinal.status) || !urlVideo) {
        definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.erroGenerico"), imagem });
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

  const aoGerarIA = useCallback(async () => {
    if (estado.fase !== "configurando" || !chave) return;
    const { imagem } = estado;
    const pillsCompletas = catalogoPillsAmbiente
      .flatMap((grupo) => grupo.pills)
      .filter((pill) => pillsSelecionadas.includes(pill.id));
    const promptFinal = montarPromptVideo(textoLivre, pillsCompletas);

    definirEstado({ fase: "gerando-ia", imagem, taskId: "", tentativa: 0 });

    const { status, corpo } = await servicoVideoIA.criarTarefa({
      apiKey: chave,
      imagem: imagem.blob,
      nomeArquivo: imagem.nomeArquivo,
      promptText: promptFinal,
      duracao,
    });

    if (canceladoRef.current) return;

    if (!respostaComSucesso(status) || !corpo.status_url || !corpo.response_url) {
      definirEstado({ fase: "erro", mensagem: t(mapearErroVideoIA(status, corpo)), imagem });
      return;
    }

    definirEstado({ fase: "gerando-ia", imagem, taskId: corpo.status_url, tentativa: 0 });
    executarPollingIA(chave, imagem, corpo.status_url, corpo.response_url, promptFinal, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, chave, textoLivre, pillsSelecionadas, duracao, t]);

  const aoGerarCamera = useCallback(async () => {
    if (estado.fase !== "configurando") return;
    const { imagem } = estado;

    if (!gravacaoDeVideoSuportada()) {
      definirEstado({ fase: "erro", mensagem: t("conta.videos.camera.semSuporteGravacao"), imagem });
      return;
    }

    definirEstado({ fase: "gerando-camera", imagem, etapa: "profundidade" });

    try {
      // Carregadas sob demanda: three.js e o modelo de estimativa de
      // profundidade só pesam o bundle de quem realmente usa o modo Câmera.
      const [{ estimarMapaProfundidade }, { criarCenaParallax }] = await Promise.all([
        import("./parallax/estimarProfundidade"),
        import("./parallax/cenaParallax"),
      ]);

      const imagemCarregada = await carregarComoImagem(imagem.dataUrl);
      const mapaProfundidade = await estimarMapaProfundidade(imagemCarregada);
      if (canceladoRef.current) return;

      definirEstado({ fase: "gerando-camera", imagem, etapa: "renderizando" });

      const proporcao = imagem.largura / imagem.altura;
      const largura = RESOLUCAO_PARALLAX_MAXIMA;
      const altura = Math.max(1, Math.round(RESOLUCAO_PARALLAX_MAXIMA / proporcao));
      const canvas = document.createElement("canvas");
      canvas.width = largura;
      canvas.height = altura;
      // Precisa estar no DOM (fora da tela, nunca display:none) pra o
      // navegador realmente compor o WebGL — um canvas desconectado não
      // renderiza de verdade e captureStream() sai só com quadros vazios.
      canvas.style.position = "fixed";
      canvas.style.left = "-99999px";
      canvas.style.top = "0";
      document.body.appendChild(canvas);

      const cena = criarCenaParallax(
        canvas,
        imagemCarregada,
        mapaProfundidade,
        movimentoCamera,
        largura,
        altura
      );
      try {
        const blobVideo = await capturarVideoParallax(canvas, cena.avancar, duracao);
        if (canceladoRef.current) return;

        if (urlLocalAtualRef.current) URL.revokeObjectURL(urlLocalAtualRef.current);
        const urlVideo = URL.createObjectURL(blobVideo);
        urlLocalAtualRef.current = urlVideo;
        definirEstado({ fase: "pronto", imagem, urlVideo });
      } finally {
        cena.destruir();
        canvas.remove();
      }
    } catch {
      if (!canceladoRef.current) {
        definirEstado({ fase: "erro", mensagem: t("conta.videos.erros.erroGenerico"), imagem });
      }
    }
  }, [estado, movimentoCamera, duracao, t]);

  const imagemAtual =
    estado.fase === "configurando" || estado.fase === "gerando-camera" || estado.fase === "gerando-ia"
      ? estado.imagem
      : estado.fase === "erro" && estado.imagem
        ? estado.imagem
        : null;

  const emGeracaoCamera = estado.fase === "gerando-camera";
  const emGeracaoIA = estado.fase === "gerando-ia";
  const etapaCamera = estado.fase === "gerando-camera" ? estado.etapa : null;
  const tentativaIA = estado.fase === "gerando-ia" ? estado.tentativa : 0;
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
            disabled={emGeracaoIA}
            className="shrink-0 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            {t("conta.videos.chave.botaoRemover")}
          </button>
        )}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
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
              className="flex w-full flex-col gap-6"
            >
              {mensagemErroPainel && (
                <p className="text-center text-sm text-erro">{mensagemErroPainel}</p>
              )}

              <div className="mx-auto w-full max-w-2xl">
                <SeletorModoGeracao modo={modoAtivo} aoMudar={definirModoAtivo} />
              </div>

              {modoAtivo === "camera" && (
                <PainelParallaxCamera
                  imagem={imagemAtual}
                  movimento={movimentoCamera}
                  aoEscolherMovimento={setMovimentoCamera}
                  duracao={duracao}
                  aoMudarDuracao={setDuracao}
                  aoGerar={aoGerarCamera}
                  aoTrocarImagem={aoTrocarImagem}
                  gerando={emGeracaoCamera}
                  etapa={etapaCamera}
                />
              )}

              {modoAtivo === "ia" && !chave && (
                <ConfiguracaoChaveVideoIA aoConfigurada={aoConfigurarChave} />
              )}

              {modoAtivo === "ia" && chave && (
                <PainelGeracaoVideo
                  imagem={imagemAtual}
                  pillsSelecionadas={pillsSelecionadas}
                  aoAlternarPill={aoAlternarPill}
                  textoLivre={textoLivre}
                  aoMudarTexto={setTextoLivre}
                  duracao={duracao}
                  aoMudarDuracao={setDuracao}
                  aoGerar={aoGerarIA}
                  aoTrocarImagem={aoTrocarImagem}
                  gerando={emGeracaoIA}
                  tentativa={tentativaIA}
                />
              )}
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
