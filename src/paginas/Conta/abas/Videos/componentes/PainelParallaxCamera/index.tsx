import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";
import SeletorMovimentoCamera from "../SeletorMovimentoCamera";
import SeletorDuracaoVideo from "../SeletorDuracaoVideo";
import type { IdMovimentoCamera, InfoImagemVideo } from "../../tipos";

interface PropriedadesPainelParallaxCamera {
  imagem: InfoImagemVideo;
  movimento: IdMovimentoCamera;
  aoEscolherMovimento: (id: IdMovimentoCamera) => void;
  duracao: 5 | 10;
  aoMudarDuracao: (duracao: 5 | 10) => void;
  aoGerar: () => void;
  aoTrocarImagem: () => void;
  gerando: boolean;
  etapa: "profundidade" | "renderizando" | null;
}

export default function PainelParallaxCamera({
  imagem,
  movimento,
  aoEscolherMovimento,
  duracao,
  aoMudarDuracao,
  aoGerar,
  aoTrocarImagem,
  gerando,
  etapa,
}: PropriedadesPainelParallaxCamera) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      <MoldeCantos corCanto="marca">
        <div className="rounded-quadro border border-borda bg-fundo-elevado p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <img
              src={imagem.dataUrl}
              alt=""
              className="h-20 w-28 shrink-0 rounded-botao border border-borda object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-texto-primario">{imagem.nomeArquivo}</p>
              <button
                type="button"
                onClick={aoTrocarImagem}
                disabled={gerando}
                className="mt-1 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline disabled:pointer-events-none disabled:opacity-40"
              >
                {t("conta.videos.pronto.trocarImagem")}
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-borda pt-6">
            <fieldset disabled={gerando} className="flex flex-col gap-6 disabled:opacity-50">
              <SeletorMovimentoCamera movimento={movimento} aoEscolher={aoEscolherMovimento} />
              <SeletorDuracaoVideo duracao={duracao} aoMudar={aoMudarDuracao} />
            </fieldset>
          </div>

          <div className="mt-6 border-t border-borda pt-6">
            <Botao tamanho="lg" className="w-full" aoClicar={aoGerar} desabilitado={gerando}>
              {gerando ? t("conta.videos.gerando") : t("conta.videos.botaoGerar")}
            </Botao>
            {gerando && etapa && (
              <p className="numero-tecnico mt-3 text-center text-xs text-texto-suave">
                {t(`conta.videos.camera.gerando.${etapa}`)}
              </p>
            )}
          </div>
        </div>
      </MoldeCantos>
    </motion.div>
  );
}
