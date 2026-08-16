import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiXMark } from "react-icons/hi2";

interface PropriedadesVisualizadorImagem {
  imagem: string | null;
  alt: string;
  aoFechar: () => void;
}

export default function VisualizadorImagem({ imagem, alt, aoFechar }: PropriedadesVisualizadorImagem) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!imagem) return;

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };

    document.addEventListener("keydown", aoPressionarTecla);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.style.overflow = "";
    };
  }, [imagem, aoFechar]);

  return (
    <AnimatePresence>
      {imagem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-fundo/95 p-6 backdrop-blur-sm"
          onClick={aoFechar}
        >
          <button
            type="button"
            onClick={aoFechar}
            aria-label={t("comuns.fechar", "Fechar")}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center border border-borda bg-superficie text-texto-primario transition-colors hover:border-marca hover:text-marca"
          >
            <HiXMark className="h-5 w-5" />
          </button>

          <motion.img
            key={imagem}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            src={imagem}
            alt={alt}
            className="max-h-full max-w-full rounded-quadro object-contain shadow-quadro"
            onClick={(evento) => evento.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
