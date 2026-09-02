import type { ReactNode } from "react";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesMoldeCantos {
  children: ReactNode;
  className?: string;
  corCanto?: "marca" | "neutro";
}

const estilosCanto: Record<NonNullable<PropriedadesMoldeCantos["corCanto"]>, string> = {
  marca: "ring-1 ring-marca/35",
  neutro: "ring-1 ring-borda",
};

export default function MoldeCantos({
  children,
  className,
  corCanto = "neutro",
}: PropriedadesMoldeCantos) {
  return (
    <div
      className={mesclarClasses(
        "overflow-hidden rounded-quadro shadow-quadro",
        estilosCanto[corCanto],
        className
      )}
    >
      {children}
    </div>
  );
}
