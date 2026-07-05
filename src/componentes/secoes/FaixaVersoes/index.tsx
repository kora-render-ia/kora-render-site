import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import { versoesSketchUp } from "../../../dados/versoes";

export default function FaixaVersoes() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-borda py-8">
      <Contentor className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <span className="numero-tecnico text-[11px] uppercase tracking-wider text-texto-suave">
          {t("faixaVersoes.rotulo")}
        </span>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {versoesSketchUp.map((versao) => (
            <li
              key={versao}
              className="numero-tecnico border border-borda px-2.5 py-1 text-[11px] text-texto-secundario"
            >
              SketchUp {versao}
            </li>
          ))}
        </motion.ul>
      </Contentor>
    </section>
  );
}
