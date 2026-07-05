import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import Botao from "../../comuns/Botao";
import AvaliacaoEstrelas from "../../comuns/AvaliacaoEstrelas";
import MoldeCantos from "../../ui/MoldeCantos";
import FundoTecnico from "../../ui/FundoTecnico";
import { previaDestaque } from "../../../dados/destaque";

export default function Destaque() {
  const { t } = useTranslation();

  return (
    <section id="destaque" className="relative overflow-hidden pb-24 pt-36 lg:pb-32 lg:pt-44">
      <FundoTecnico comBrilho />

      {/* Avaliação na margem, estilo anotação técnica */}
      <div
        className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        <div className="flex items-center gap-3 text-texto-suave">
          <AvaliacaoEstrelas
            nota={previaDestaque.notaAvaliacao}
            tamanho={10}
            className="flex-col"
          />
          <span className="numero-tecnico rotate-180 text-[10px] uppercase tracking-wider">
            {t("destaque.avaliacaoContagem")} {t("destaque.avaliacaoRotulo")}
          </span>
        </div>
      </div>

      <Contentor className="relative">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="numero-tecnico mb-6 inline-flex items-center gap-2 border border-borda px-3 py-1.5 text-[11px] uppercase tracking-wider text-marca"
        >
          <span className="h-1 w-1 bg-marca" aria-hidden="true" />
          {t("destaque.marcador")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="equilibrio-texto max-w-4xl font-titulo text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-texto-primario sm:text-6xl lg:text-[4.75rem]"
        >
          <span>{t("destaque.tituloAntes")}</span>
          <span className="text-marca">{t("destaque.tituloDestaque")}</span>
          <span>{t("destaque.tituloDepois")}</span>
        </motion.h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <p className="text-[15px] leading-relaxed text-texto-secundario">
              {t("destaque.descricao")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Botao href="#planos" tamanho="lg">
                {t("destaque.ctaPrimario")}
              </Botao>
              <Botao href="#videos" variante="secundario" tamanho="lg">
                {t("destaque.ctaSecundario")}
              </Botao>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.26 }}
            className="ml-auto w-full max-w-xl"
          >
            <MoldeCantos corCanto="marca">
              <div className="overflow-hidden border border-borda bg-fundo-elevado">
                <div className="flex items-center gap-2 border-b border-borda bg-superficie px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#28c840]" aria-hidden="true" />
                  <span className="numero-tecnico ml-2 text-[11px] text-texto-suave">
                    {previaDestaque.nomeApp} · {previaDestaque.nomeArquivo}
                  </span>
                </div>

                <div className="relative aspect-[4/3]">
                  <img
                    src={previaDestaque.imagem}
                    alt="Render fotorrealista de sala de estar gerado pelo Kora"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-3 bottom-3 space-y-2">
                    <div className="border border-white/10 bg-black/65 p-3 backdrop-blur-sm">
                      <div className="numero-tecnico flex items-center justify-between text-[11px]">
                        <span className="text-white/80">{t("destaque.previaStatus")}</span>
                        <span className="text-marca">{previaDestaque.progresso}%</span>
                      </div>
                      <div className="mt-2 h-[3px] w-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${previaDestaque.progresso}%` }}
                          transition={{ duration: 1.3, delay: 0.7, ease: "easeOut" }}
                          className="h-full bg-marca"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MoldeCantos>
            <p className="numero-tecnico mt-3 text-[11px] text-texto-suave">
              {t("destaque.legendaFigura")}
            </p>
          </motion.div>
        </div>
      </Contentor>
    </section>
  );
}
