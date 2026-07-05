import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesFundoTecnico {
  className?: string;
  comBrilho?: boolean;
}

export default function FundoTecnico({ className, comBrilho = false }: PropriedadesFundoTecnico) {
  return (
    <div
      aria-hidden="true"
      className={mesclarClasses(
        "pointer-events-none absolute inset-0 overflow-hidden textura-plano",
        className
      )}
    >
      {comBrilho && (
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-marca/[0.07] blur-[120px]" />
      )}
      <div className="mira absolute left-6 top-6 opacity-40 sm:left-10 sm:top-10" />
      <div className="mira absolute right-6 top-6 opacity-40 sm:right-10 sm:top-10" />
      <div className="mira absolute bottom-6 left-6 opacity-40 sm:bottom-10 sm:left-10" />
      <div className="mira absolute bottom-6 right-6 opacity-40 sm:bottom-10 sm:right-10" />
    </div>
  );
}
