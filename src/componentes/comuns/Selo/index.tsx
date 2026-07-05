import type { ReactNode } from "react";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesSelo {
  children: ReactNode;
  variante?: "marca" | "neutro" | "contorno";
  className?: string;
  icone?: ReactNode;
}

const estilosVariante: Record<NonNullable<PropriedadesSelo["variante"]>, string> = {
  marca: "border-marca/30 bg-marca-suave text-marca",
  neutro: "border-borda text-texto-secundario",
  contorno: "border-borda-forte text-texto-secundario",
};

export default function Selo({
  children,
  variante = "neutro",
  className,
  icone,
}: PropriedadesSelo) {
  return (
    <span
      className={mesclarClasses(
        "numero-tecnico inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] uppercase tracking-wider",
        estilosVariante[variante],
        className
      )}
    >
      {icone}
      {children}
    </span>
  );
}
