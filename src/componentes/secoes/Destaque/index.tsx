import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import Botao from "../../comuns/Botao";
import MoldeCantos from "../../ui/MoldeCantos";
import FundoTecnico from "../../ui/FundoTecnico";
import ComparadorAntesDepois from "../../ui/ComparadorAntesDepois";
import { imagensAntesDepois } from "../../../dados/antesDepois";

export default function Destaque() {
  const { t } = useTranslation();

  const rotuloAntes = t("antesDepois.rotuloAntes");
  const rotuloDepois = t("antesDepois.rotuloDepois");

  return (
    <section id="destaque" className="relative overflow-hidden pb-24 pt-36 lg:pb-32 lg:pt-44">
      <FundoTecnico comBrilho />

      <Contentor className="relative flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="equilibrio-texto mx-auto max-w-4xl font-titulo text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-texto-primario sm:text-6xl lg:text-[4.75rem]"
        >
          <span>{t("destaque.tituloAntes")}</span>
          <span className="text-marca">{t("destaque.tituloDestaque")}</span>
          <span>{t("destaque.tituloDepois")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 max-w-2xl text-[15px] leading-relaxed text-texto-secundario"
        >
          {t("destaque.descricao")}
        </motion.p>

        <MoldeCantos className="mt-10 w-full max-w-5xl" corCanto="marca">
          <ComparadorAntesDepois
            imagemAntes={imagensAntesDepois.antes}
            imagemDepois={imagensAntesDepois.depois}
            rotuloAntes={rotuloAntes}
            rotuloDepois={rotuloDepois}
            descricaoAria={t("antesDepois.descricao")}
            className="aspect-[16/10] border border-borda sm:aspect-[21/9]"
          />
        </MoldeCantos>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Botao href="#planos" tamanho="lg">
            {t("destaque.ctaPrimario")}
          </Botao>
          <Botao href="#videos" variante="secundario" tamanho="lg">
            {t("destaque.ctaSecundario")}
          </Botao>
        </motion.div>
      </Contentor>
    </section>
  );
}
