import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";

interface EtapaTraducao {
  titulo: string;
  descricao: string;
}

export default function ComoFunciona() {
  const { t } = useTranslation();
  const etapas = t("comoFunciona.etapas", { returnObjects: true }) as EtapaTraducao[];

  return (
    <section id="como-funciona" className="border-y border-borda py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="03"
          marcador={t("comoFunciona.marcador")}
          titulo={t("comoFunciona.titulo")}
          descricao={t("comoFunciona.descricao")}
        />

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-borda pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-borda">
          {etapas.map((etapa, i) => (
            <motion.div
              key={etapa.titulo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="lg:px-8 lg:first:pl-0 lg:last:pr-0"
            >
              <span className="numero-tecnico text-[11px] text-marca">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-titulo text-base font-semibold text-texto-primario">
                {etapa.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
                {etapa.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </Contentor>
    </section>
  );
}
