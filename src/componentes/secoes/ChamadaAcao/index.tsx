import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import Botao from "../../comuns/Botao";
import FundoTecnico from "../../ui/FundoTecnico";

export default function ChamadaAcao() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-y border-borda py-24 lg:py-32">
      <FundoTecnico comBrilho />

      <Contentor className="relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="equilibrio-texto mx-auto max-w-2xl font-titulo text-3xl font-semibold tracking-tight text-texto-primario sm:text-5xl"
        >
          <span>{t("chamadaAcao.tituloAntes")}</span>
          <span className="text-marca">{t("chamadaAcao.tituloDestaque")}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-md text-sm text-texto-secundario sm:text-base"
        >
          {t("chamadaAcao.descricao")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Botao href="#planos" tamanho="lg">
            {t("chamadaAcao.rotuloPrimario")}
          </Botao>
          <Botao href="#videos" variante="secundario" tamanho="lg">
            {t("chamadaAcao.rotuloSecundario")}
          </Botao>
        </motion.div>
      </Contentor>
    </section>
  );
}
