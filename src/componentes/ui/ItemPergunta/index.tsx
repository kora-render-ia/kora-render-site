import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesItemPergunta {
  indice: number;
  pergunta: string;
  resposta: string;
  aberto: boolean;
  aoAlternar: () => void;
}

export default function ItemPergunta({
  indice,
  pergunta,
  resposta,
  aberto,
  aoAlternar,
}: PropriedadesItemPergunta) {
  const idPainel = `painel-faq-${indice}`;

  return (
    <div className="border-b border-borda">
      <button
        type="button"
        onClick={aoAlternar}
        aria-expanded={aberto}
        aria-controls={idPainel}
        className="flex w-full items-center gap-4 py-4 text-left"
      >
        <span
          className={mesclarClasses(
            "numero-tecnico text-[11px]",
            aberto ? "text-marca" : "text-texto-suave"
          )}
        >
          Q{String(indice + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm font-medium text-texto-primario">{pergunta}</span>
        <span
          className={mesclarClasses(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            aberto ? "border-marca text-marca" : "border-borda-forte text-texto-suave"
          )}
          aria-hidden="true"
        >
          {aberto ? <HiMinus size={11} /> : <HiPlus size={11} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id={idPainel}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-lg pb-4 pl-[3.1rem] text-sm leading-relaxed text-texto-secundario">
              {resposta}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
