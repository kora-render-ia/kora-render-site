import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import MoldeCantos from "../MoldeCantos";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import type { ItemGaleria } from "../../../tipos";

interface PropriedadesQuadroGaleria {
  item: ItemGaleria;
  indice: number;
}

export default function QuadroGaleria({ item, indice }: PropriedadesQuadroGaleria) {
  const { t } = useTranslation();
  const rotulo = t(`galeria.categorias.${item.categoria}`);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (indice % 6) * 0.04 }}
      className={mesclarClasses(
        "w-[260px] shrink-0 snap-start sm:w-[320px]",
        item.destaqueVertical && "sm:w-[280px]"
      )}
    >
      <MoldeCantos>
        <div
          className={mesclarClasses(
            "overflow-hidden border border-borda bg-superficie",
            item.destaqueVertical ? "aspect-[3/4]" : "aspect-[4/3]"
          )}
        >
          <img
            src={item.imagem}
            alt={`${t("galeria.titulo")} — ${rotulo}`}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[15%] transition-all duration-500 hover:grayscale-0"
          />
        </div>
      </MoldeCantos>
      <div className="numero-tecnico mt-2.5 flex items-center justify-between text-[11px] text-texto-suave">
        <span className="uppercase tracking-wide">{rotulo}</span>
        <span>{String(indice + 1).padStart(2, "0")}</span>
      </div>
    </motion.div>
  );
}
