import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import MoldeCantos from "../MoldeCantos";
import type { ItemGaleria } from "../../../tipos";

interface PropriedadesQuadroGaleria {
  item: ItemGaleria;
  indice: number;
  aoClicar: (item: ItemGaleria) => void;
}

export default function QuadroGaleria({ item, indice, aoClicar }: PropriedadesQuadroGaleria) {
  const { t } = useTranslation();
  const rotulo = t(`galeria.categorias.${item.categoria}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (indice % 6) * 0.04 }}
      className="w-full"
    >
      <MoldeCantos>
        <button
          type="button"
          onClick={() => aoClicar(item)}
          className="block aspect-[4/3] w-full cursor-zoom-in overflow-hidden border border-borda bg-superficie sm:aspect-auto"
        >
          <img
            src={item.imagem}
            alt={`${t("galeria.titulo")} — ${rotulo}`}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[15%] transition-all duration-500 hover:grayscale-0 sm:h-auto"
          />
        </button>
      </MoldeCantos>
      <div className="numero-tecnico mt-2.5 flex items-center justify-between text-[11px] text-texto-suave">
        <span className="uppercase tracking-wide">{rotulo}</span>
        <span>{String(indice + 1).padStart(2, "0")}</span>
      </div>
    </motion.div>
  );
}
