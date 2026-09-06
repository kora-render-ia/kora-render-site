import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";

interface PropriedadesReprodutorVideoGerado {
  urlVideo: string;
  aoGerarOutro: () => void;
}

export default function ReprodutorVideoGerado({ urlVideo, aoGerarOutro }: PropriedadesReprodutorVideoGerado) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      <MoldeCantos corCanto="marca">
        <div className="overflow-hidden rounded-quadro border border-borda bg-fundo-elevado">
          <video src={urlVideo} controls className="aspect-video w-full bg-black" />
        </div>
      </MoldeCantos>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Botao
          href={urlVideo}
          target="_blank"
          rel="noopener noreferrer"
          variante="secundario"
          icone={<HiOutlineArrowDownTray size={15} aria-hidden="true" />}
        >
          {t("conta.videos.pronto.baixar")}
        </Botao>
        <Botao aoClicar={aoGerarOutro}>{t("conta.videos.pronto.gerarOutro")}</Botao>
      </div>
    </motion.div>
  );
}
