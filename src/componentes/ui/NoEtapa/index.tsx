import { motion } from "framer-motion";

interface PropriedadesNoEtapa {
  numero: string;
  titulo: string;
  descricao: string;
  indice: number;
}

export default function NoEtapa({ numero, titulo, descricao, indice }: PropriedadesNoEtapa) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: indice * 0.12 }}
      className="relative flex gap-6 pb-14 last:pb-0"
    >
      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border border-marca bg-fundo">
        <span className="numero-tecnico text-sm text-marca">{numero}</span>
      </div>
      <div className="pt-1.5">
        <h3 className="font-titulo text-lg font-semibold text-texto-primario">{titulo}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-texto-secundario">{descricao}</p>
      </div>
    </motion.div>
  );
}
