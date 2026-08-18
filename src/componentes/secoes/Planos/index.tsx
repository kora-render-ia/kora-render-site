import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi2";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import Selo from "../../comuns/Selo";
import Botao from "../../comuns/Botao";
import MoldeCantos from "../../ui/MoldeCantos";

export default function Planos() {
  const { t } = useTranslation();
  const recursos = t("planos.recursos", { returnObjects: true }) as string[];

  return (
    <section id="planos" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="08"
          marcador={t("planos.marcador")}
          titulo={t("planos.titulo")}
          descricao={t("planos.subtitulo")}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <MoldeCantos corCanto="marca">
            <div className="rounded-quadro border border-marca/40 bg-fundo-elevado p-8 sm:p-10">
              <Selo variante="marca">{t("planos.selo")}</Selo>

              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <span className="font-titulo text-5xl font-semibold text-texto-primario">
                  {t("planos.preco")}
                </span>
                <span className="text-sm text-texto-suave">{t("planos.validade")}</span>
              </div>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-texto-secundario">
                {t("planos.descricao")}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className="numero-tecnico inline-flex items-center rounded-selo border border-borda bg-superficie px-3 py-1.5 text-[11px] uppercase tracking-wide text-texto-secundario">
                  {t("planos.custoApiSelo")}
                </span>
                <span className="text-sm text-texto-suave">{t("planos.custoApiDescricao")}</span>
              </div>

              <Botao href="#" tamanho="lg" className="mt-6 w-full sm:w-auto">
                {t("planos.rotuloCta")}
              </Botao>

              <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-borda pt-6 sm:grid-cols-2">
                {recursos.map((recurso) => (
                  <li key={recurso} className="flex items-start gap-2.5 text-sm text-texto-secundario">
                    <HiCheck className="mt-0.5 shrink-0 text-marca" size={15} aria-hidden="true" />
                    <span>{recurso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MoldeCantos>
        </motion.div>
      </Contentor>
    </section>
  );
}
