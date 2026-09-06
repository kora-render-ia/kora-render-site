import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";
import SeletorPillsMovimento from "../SeletorPillsMovimento";
import SeletorDuracaoVideo from "../SeletorDuracaoVideo";
import type { InfoImagemVideo } from "../../tipos";

const TENTATIVAS_MAXIMAS = 150;

interface PropriedadesPainelGeracaoVideo {
  imagem: InfoImagemVideo;
  pillsSelecionadas: string[];
  aoAlternarPill: (id: string) => void;
  textoLivre: string;
  aoMudarTexto: (valor: string) => void;
  duracao: 5 | 10;
  aoMudarDuracao: (duracao: 5 | 10) => void;
  aoGerar: () => void;
  aoTrocarImagem: () => void;
  gerando: boolean;
  tentativa: number;
}

export default function PainelGeracaoVideo({
  imagem,
  pillsSelecionadas,
  aoAlternarPill,
  textoLivre,
  aoMudarTexto,
  duracao,
  aoMudarDuracao,
  aoGerar,
  aoTrocarImagem,
  gerando,
  tentativa,
}: PropriedadesPainelGeracaoVideo) {
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
              <SeletorPillsMovimento
                pillsSelecionadas={pillsSelecionadas}
                aoAlternarPill={aoAlternarPill}
                textoLivre={textoLivre}
                aoMudarTexto={aoMudarTexto}
              />
              <SeletorDuracaoVideo duracao={duracao} aoMudar={aoMudarDuracao} />
            </fieldset>
          </div>

          <div className="mt-6 border-t border-borda pt-6">
            <Botao tamanho="lg" className="w-full" aoClicar={aoGerar} desabilitado={gerando}>
              {gerando
                ? t("conta.videos.gerando")
                : t("conta.videos.botaoGerar")}
            </Botao>
            {gerando && (
              <p className="numero-tecnico mt-3 text-center text-xs text-texto-suave">
                {t("conta.videos.tentativaProgresso", { atual: tentativa, total: TENTATIVAS_MAXIMAS })}
              </p>
            )}
          </div>
        </div>
      </MoldeCantos>
    </motion.div>
  );
}
