import type { HTMLAttributes, ReactNode } from "react";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesContentor extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  como?: "div" | "section";
}

export default function Contentor({
  children,
  className,
  como = "div",
  ...resto
}: PropriedadesContentor) {
  const Tag = como;
  return (
    <Tag
      className={mesclarClasses("mx-auto w-full max-w-[90rem] px-6 lg:px-12", className)}
      {...resto}
    >
      {children}
    </Tag>
  );
}
