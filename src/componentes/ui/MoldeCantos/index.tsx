import type { ReactNode } from "react";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesMoldeCantos {
  children: ReactNode;
  className?: string;
  corCanto?: "marca" | "neutro";
  tamanhoCanto?: number;
}

export default function MoldeCantos({
  children,
  className,
  corCanto = "neutro",
  tamanhoCanto = 16,
}: PropriedadesMoldeCantos) {
  const cor = corCanto === "marca" ? "border-marca" : "border-texto-suave";

  const cantoBase = "absolute h-4 w-4 pointer-events-none";
  const estiloCanto = { width: tamanhoCanto, height: tamanhoCanto };

  return (
    <div className={mesclarClasses("relative", className)}>
      <span
        className={mesclarClasses(cantoBase, cor, "left-0 top-0 border-l-2 border-t-2")}
        style={estiloCanto}
        aria-hidden="true"
      />
      <span
        className={mesclarClasses(cantoBase, cor, "right-0 top-0 border-r-2 border-t-2")}
        style={estiloCanto}
        aria-hidden="true"
      />
      <span
        className={mesclarClasses(cantoBase, cor, "bottom-0 left-0 border-b-2 border-l-2")}
        style={estiloCanto}
        aria-hidden="true"
      />
      <span
        className={mesclarClasses(cantoBase, cor, "bottom-0 right-0 border-b-2 border-r-2")}
        style={estiloCanto}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
