import { motion } from "framer-motion";
import { HiPlay } from "react-icons/hi2";

interface PropriedadesFitaVideo {
  titulo: string;
  codigoTempo: string;
  indice: number;
  aoReproduzir?: () => void;
}

export default function FitaVideo({
  titulo,
  codigoTempo,
  indice,
  aoReproduzir,
}: PropriedadesFitaVideo) {
  return (
    <motion.button
      type="button"
      onClick={aoReproduzir}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: indice * 0.07 }}
      className="group relative aspect-video overflow-hidden rounded-quadro border border-borda bg-superficie text-left shadow-suave"
      aria-label={titulo}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marca text-white shadow-suave transition-transform duration-200 group-hover:scale-105">
          <HiPlay size={17} aria-hidden="true" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-2">
        <p className="text-[13px] font-medium text-white">{titulo}</p>
        <p className="numero-tecnico text-[11px] text-white/60">{codigoTempo}</p>
      </div>
    </motion.button>
  );
}
