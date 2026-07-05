import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiCheck, HiClock } from "react-icons/hi2";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import { itensCompatibilidade, rotulosCompatibilidade } from "../../../dados/compatibilidade";

export default function Compatibilidade() {
  const { t } = useTranslation();
  const metade = Math.ceil(itensCompatibilidade.length / 2);
  const colunas = [itensCompatibilidade.slice(0, metade), itensCompatibilidade.slice(metade)];

  return (
    <section className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="07"
          marcador={t("compatibilidade.marcador")}
          titulo={t("compatibilidade.titulo")}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {colunas.map((coluna, indiceColuna) => (
            <div key={indiceColuna} className="border-t border-borda">
              {coluna.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center justify-between border-b border-borda py-4"
                >
                  <span className="text-sm text-texto-primario">
                    {rotulosCompatibilidade[item.id]}
                  </span>
                  <span
                    className={mesclarClasses(
                      "numero-tecnico flex items-center gap-1.5 text-[11px] uppercase tracking-wide",
                      item.suportado ? "text-marca" : "text-texto-suave"
                    )}
                  >
                    {item.suportado ? <HiCheck size={13} /> : <HiClock size={13} />}
                    {item.suportado ? t("compatibilidade.suportado") : t("compatibilidade.emBreve")}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </Contentor>
    </section>
  );
}
