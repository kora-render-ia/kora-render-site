import { FaStar } from "react-icons/fa";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesAvaliacaoEstrelas {
  nota?: number;
  maximo?: number;
  tamanho?: number;
  className?: string;
}

export default function AvaliacaoEstrelas({
  nota = 5,
  maximo = 5,
  tamanho = 12,
  className,
}: PropriedadesAvaliacaoEstrelas) {
  return (
    <div
      className={mesclarClasses("flex items-center gap-0.5", className)}
      aria-label={`${nota} de ${maximo} estrelas`}
    >
      {Array.from({ length: maximo }).map((_, i) => (
        <FaStar
          key={i}
          size={tamanho}
          className={i < nota ? "text-acento" : "text-borda-forte"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
