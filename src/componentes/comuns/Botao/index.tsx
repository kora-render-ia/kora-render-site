import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import type { PropriedadesBotao } from "./tipos";

const estilosVariante: Record<NonNullable<PropriedadesBotao["variante"]>, string> = {
  primario: "bg-marca text-white shadow-suave hover:bg-marca-escura",
  secundario:
    "bg-transparent text-texto-primario border border-borda-forte hover:border-marca hover:text-marca",
  fantasma: "bg-transparent text-texto-secundario hover:text-texto-primario",
};

const estilosTamanho: Record<NonNullable<PropriedadesBotao["tamanho"]>, string> = {
  sm: "h-9 px-4 text-xs gap-2",
  md: "h-11 px-5 text-sm gap-2.5",
  lg: "h-12 px-6 text-sm gap-3",
};

export default function Botao({
  variante = "primario",
  tamanho = "md",
  href,
  icone,
  posicaoIcone = "direita",
  children,
  className,
  type = "button",
  desabilitado,
  aoClicar,
  ...resto
}: PropriedadesBotao) {
  const classes = mesclarClasses(
    "group relative inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium tracking-wide transition-colors duration-200",
    desabilitado && "pointer-events-none opacity-40",
    estilosVariante[variante],
    estilosTamanho[tamanho],
    className
  );

  const iconePadrao = icone ?? <HiArrowUpRight size={15} aria-hidden="true" />;

  const conteudo = (
    <>
      {posicaoIcone === "esquerda" && (
        <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
          {iconePadrao}
        </span>
      )}
      <span>{children}</span>
      {posicaoIcone === "direita" && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {iconePadrao}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={{ scale: 0.97 }}
        onClick={aoClicar}
        {...resto}
      >
        {conteudo}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={desabilitado}
      className={classes}
      whileTap={{ scale: 0.97 }}
      onClick={aoClicar}
      {...resto}
    >
      {conteudo}
    </motion.button>
  );
}
