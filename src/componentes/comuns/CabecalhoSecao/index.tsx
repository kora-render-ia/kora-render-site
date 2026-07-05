import { motion } from "framer-motion";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import type { PropriedadesCabecalhoSecao } from "./tipos";

export default function CabecalhoSecao({
  numero,
  marcador,
  titulo,
  descricao,
  alinhamento = "esquerda",
  className,
}: PropriedadesCabecalhoSecao) {
  return (
    <div className={mesclarClasses(alinhamento === "centro" && "mx-auto text-center", className)}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={mesclarClasses(
          "numero-tecnico flex items-center gap-3 text-[11px] text-texto-suave",
          alinhamento === "centro" && "justify-center"
        )}
      >
        <span className="text-marca">{numero}</span>
        <span className="h-px w-8 bg-borda-forte" aria-hidden="true" />
        <span className="uppercase">{marcador}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="equilibrio-texto mt-4 max-w-2xl font-titulo text-3xl font-semibold leading-[1.15] tracking-tight text-texto-primario sm:text-4xl"
      >
        {titulo}
      </motion.h2>

      {descricao && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={mesclarClasses(
            "mt-4 max-w-md text-[15px] leading-relaxed text-texto-secundario",
            alinhamento === "centro" && "mx-auto"
          )}
        >
          {descricao}
        </motion.p>
      )}
    </div>
  );
}
