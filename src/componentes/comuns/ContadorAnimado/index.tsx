import { useContagem } from "../../../ganchos/useContagem";

interface PropriedadesContadorAnimado {
  fim: number;
  prefixo?: string;
  sufixo?: string;
  casasDecimais?: number;
  className?: string;
}

export default function ContadorAnimado({
  fim,
  prefixo = "",
  sufixo = "",
  casasDecimais = 0,
  className,
}: PropriedadesContadorAnimado) {
  const { referencia, valor } = useContagem({ fim, casasDecimais });

  return (
    <span ref={referencia as React.RefObject<HTMLSpanElement>} className={className}>
      {prefixo}
      {valor.toLocaleString("pt-BR", {
        minimumFractionDigits: casasDecimais,
        maximumFractionDigits: casasDecimais,
      })}
      {sufixo}
    </span>
  );
}
