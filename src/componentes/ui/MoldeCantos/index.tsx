import type { ReactNode } from "react";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesMoldeCantos {
  children: ReactNode;
  className?: string;
  corCanto?: "marca" | "neutro";
}

export default function MoldeCantos({ children, className }: PropriedadesMoldeCantos) {
  return (
    <div className={mesclarClasses("overflow-hidden rounded-quadro shadow-quadro", className)}>
      {children}
    </div>
  );
}
