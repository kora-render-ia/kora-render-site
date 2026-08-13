import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiXMark } from "react-icons/hi2";
import ComparadorAntesDepois from "../ComparadorAntesDepois";

export interface ItemAntesDepoisExpandido {
  antes: string;
  depois: string;
  proporcao: string;
  descricaoAria: string;
}

interface PropriedadesVisualizadorAntesDepois {
  item: ItemAntesDepoisExpandido | null;
  rotuloAntes: string;
  rotuloDepois: string;
  aoFechar: () => void;
}

export default function VisualizadorAntesDepois({
  item,
  rotuloAntes,
  rotuloDepois,
  aoFechar,
}: PropriedadesVisualizadorAntesDepois) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!item) return;

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };

    document.addEventListener("keydown", aoPressionarTecla);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.style.overflow = "";
    };
  }, [item, aoFechar]);

  return (
    <AnimatePresence>
      {item && (
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

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-4xl"
            onClick={(evento) => evento.stopPropagation()}
          >
            <ComparadorAntesDepois
              imagemAntes={item.antes}
              imagemDepois={item.depois}
              rotuloAntes={rotuloAntes}
              rotuloDepois={rotuloDepois}
              descricaoAria={item.descricaoAria}
              className="rounded-quadro shadow-quadro"
              style={{ aspectRatio: item.proporcao }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
