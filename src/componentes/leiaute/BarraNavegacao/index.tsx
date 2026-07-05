import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import { useRolagem } from "../../../ganchos/useRolagem";
import { NOME_SITE } from "../../../constantes";
import Botao from "../../comuns/Botao";
import SeletorIdioma from "../../comuns/SeletorIdioma";

const itensNavegacao = [
  { chave: "comoFunciona", href: "#como-funciona" },
  { chave: "funcionalidades", href: "#recursos" },
  { chave: "galeria", href: "#galeria" },
  { chave: "planos", href: "#planos" },
  { chave: "faq", href: "#faq" },
] as const;

export default function BarraNavegacao() {
  const { t } = useTranslation();
  const rolou = useRolagem(12);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header
      className={mesclarClasses(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        rolou ? "border-borda bg-fundo/90 backdrop-blur-sm" : "border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-6 lg:px-12">
        <a href="#destaque" className="flex items-center gap-2.5 text-texto-primario">
          <span className="corte-canto-sm flex h-7 w-7 items-center justify-center bg-marca text-[13px] font-bold text-[#171208]">
            K
          </span>
          <span className="font-titulo text-lg font-semibold">{NOME_SITE}</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {itensNavegacao.map((item, i) => (
            <li key={item.chave} className="numero-tecnico flex items-center gap-1.5">
              <span className="text-[10px] text-texto-suave">{String(i + 1).padStart(2, "0")}</span>
              <a
                href={item.href}
                className="text-[13px] text-texto-secundario transition-colors hover:text-texto-primario"
              >
                {t(`navegacao.${item.chave}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <SeletorIdioma />
          <Botao href="#planos" tamanho="sm">
            {t("navegacao.cta")}
          </Botao>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SeletorIdioma />
          <button
            type="button"
            className="text-texto-primario"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? <HiXMark size={22} /> : <HiBars3 size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-borda bg-fundo md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {itensNavegacao.map((item, i) => (
                <li key={item.chave} className="numero-tecnico flex items-center gap-2 py-2">
                  <span className="text-[10px] text-texto-suave">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className="text-sm text-texto-secundario hover:text-texto-primario"
                  >
                    {t(`navegacao.${item.chave}`)}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Botao href="#planos" tamanho="sm" className="w-full">
                  {t("navegacao.cta")}
                </Botao>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
