import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import { BandeiraBrasil, BandeiraEUA } from "../../ui/IconeBandeira";
import { opcoesIdioma } from "./tipos";

const mapaBandeiras = {
  "pt-BR": BandeiraBrasil,
  en: BandeiraEUA,
};

interface PropriedadesSeletorIdioma {
  className?: string;
}

export default function SeletorIdioma({ className }: PropriedadesSeletorIdioma) {
  const { i18n, t } = useTranslation();
  const [aberto, setAberto] = useState(false);
  const referenciaContentor = useRef<HTMLDivElement>(null);

  const codigoAtual = (i18n.resolvedLanguage ?? "pt-BR") as "pt-BR" | "en";
  const BandeiraAtual = mapaBandeiras[codigoAtual] ?? mapaBandeiras["pt-BR"];

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (
        referenciaContentor.current &&
        !referenciaContentor.current.contains(evento.target as Node)
      ) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  function selecionar(codigo: "pt-BR" | "en") {
    i18n.changeLanguage(codigo);
    setAberto(false);
  }

  return (
    <div ref={referenciaContentor} className={mesclarClasses("relative", className)}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={t("idioma.rotulo")}
        className="flex items-center gap-1.5 rounded-lg border border-borda px-2 py-1.5 text-texto-secundario transition-colors hover:border-borda-forte hover:text-texto-primario"
      >
        <BandeiraAtual tamanho={15} />
        <HiChevronDown
          size={12}
          aria-hidden="true"
          className={mesclarClasses("transition-transform duration-200", aberto && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-borda bg-fundo-elevado py-1 shadow-suave"
          >
            {opcoesIdioma.map((opcao) => {
              const Bandeira = mapaBandeiras[opcao.codigo];
              const ativo = codigoAtual === opcao.codigo;
              return (
                <li key={opcao.codigo}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={ativo}
                    onClick={() => selecionar(opcao.codigo)}
                    className={mesclarClasses(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                      ativo
                        ? "bg-marca-suave text-marca"
                        : "text-texto-secundario hover:bg-superficie-hover hover:text-texto-primario"
                    )}
                  >
                    <Bandeira tamanho={15} />
                    {t(opcao.chaveRotulo)}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
