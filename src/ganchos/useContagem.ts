import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface OpcoesContagem {
  fim: number;
  duracao?: number;
  casasDecimais?: number;
}

/**
 * Anima um número de 0 até `fim` quando o elemento entra na viewport.
 */
export function useContagem({ fim, duracao = 1.4, casasDecimais = 0 }: OpcoesContagem) {
  const referencia = useRef<HTMLElement | null>(null);
  const estaVisivel = useInView(referencia, { once: true, margin: "-80px" });
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!estaVisivel) return;

    let idQuadro: number;
    const inicio = performance.now();

    const avancar = (agora: number) => {
      const progresso = Math.min((agora - inicio) / (duracao * 1000), 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setValor(Number((suavizado * fim).toFixed(casasDecimais)));
      if (progresso < 1) idQuadro = requestAnimationFrame(avancar);
    };

    idQuadro = requestAnimationFrame(avancar);
    return () => cancelAnimationFrame(idQuadro);
  }, [estaVisivel, fim, duracao, casasDecimais]);

  return { referencia, valor };
}
