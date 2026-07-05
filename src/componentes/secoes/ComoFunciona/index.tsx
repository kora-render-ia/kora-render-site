import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import NoEtapa from "../../ui/NoEtapa";

interface EtapaTraducao {
  titulo: string;
  descricao: string;
}

export default function ComoFunciona() {
  const { t } = useTranslation();
  const etapas = t("comoFunciona.etapas", { returnObjects: true }) as EtapaTraducao[];
  const referenciaLinha = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: referenciaLinha,
    offset: ["start 0.8", "end 0.6"],
  });
  const alturaLinha = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="como-funciona" className="py-20 lg:py-28">
      <Contentor className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <CabecalhoSecao
          numero="03"
          marcador={t("comoFunciona.marcador")}
          titulo={t("comoFunciona.titulo")}
        />

        <div ref={referenciaLinha} className="relative">
          <div className="absolute left-[21px] top-2 bottom-14 w-px bg-borda" aria-hidden="true" />
          <motion.div
            className="absolute left-[21px] top-2 w-px bg-marca"
            style={{ height: alturaLinha }}
            aria-hidden="true"
          />
          {etapas.map((etapa, i) => (
            <NoEtapa
              key={etapa.titulo}
              numero={String(i + 1).padStart(2, "0")}
              titulo={etapa.titulo}
              descricao={etapa.descricao}
              indice={i}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
