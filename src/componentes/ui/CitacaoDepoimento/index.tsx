import { motion } from "framer-motion";
import AvaliacaoEstrelas from "../../comuns/AvaliacaoEstrelas";

interface PropriedadesCitacaoDepoimento {
  numero: string;
  nome: string;
  cargo: string;
  citacao: string;
  nota: number;
  indice: number;
}

export default function CitacaoDepoimento({
  numero,
  nome,
  cargo,
  citacao,
  nota,
  indice,
}: PropriedadesCitacaoDepoimento) {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: indice * 0.08 }}
      className="grid grid-cols-1 gap-6 border-t border-borda py-8 last:border-b sm:grid-cols-[3rem_1fr_12rem]"
    >
      <span className="numero-tecnico text-2xl text-borda-forte">{numero}</span>

      <p className="font-titulo text-lg leading-snug text-texto-primario sm:text-xl">"{citacao}"</p>

      <div className="flex items-start gap-3 sm:flex-col sm:items-end sm:text-right">
        <div className="flex items-center gap-3 sm:flex-row-reverse">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-borda-forte bg-fundo-elevado text-xs font-semibold text-texto-secundario"
            aria-hidden="true"
          >
            {iniciais}
          </div>
          <div>
            <p className="text-sm font-medium text-texto-primario">{nome}</p>
            <p className="text-xs text-texto-suave">{cargo}</p>
          </div>
        </div>
        <AvaliacaoEstrelas nota={nota} tamanho={10} className="sm:justify-end" />
      </div>
    </motion.div>
  );
}
