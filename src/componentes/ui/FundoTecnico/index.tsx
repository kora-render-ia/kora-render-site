import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesFundoTecnico {
  className?: string;
  comBrilho?: boolean;
}

export default function FundoTecnico({ className, comBrilho = false }: PropriedadesFundoTecnico) {
  if (!comBrilho) return null;

  return (
    <div
      aria-hidden="true"
      className={mesclarClasses("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-marca/[0.08] blur-[140px]" />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-acento/[0.14] blur-[120px]" />
    </div>
  );
}
