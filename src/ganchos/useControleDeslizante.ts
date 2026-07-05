import { useCallback, useRef, useState } from "react";

/**
 * Lógica de arraste para o comparador antes/depois.
 * Retorna a referência do contentor, a posição atual (0-100) e os handlers de ponteiro.
 */
export function useControleDeslizante(inicial = 50) {
  const referenciaContentor = useRef<HTMLDivElement | null>(null);
  const [posicao, setPosicao] = useState(inicial);
  const arrastando = useRef(false);

  const atualizarPelaPosicaoX = useCallback((clienteX: number) => {
    const el = referenciaContentor.current;
    if (!el) return;
    const retangulo = el.getBoundingClientRect();
    const proporcao = ((clienteX - retangulo.left) / retangulo.width) * 100;
    setPosicao(Math.min(100, Math.max(0, proporcao)));
  }, []);

  const aoPressionar = useCallback(
    (e: React.PointerEvent) => {
      arrastando.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      atualizarPelaPosicaoX(e.clientX);
    },
    [atualizarPelaPosicaoX]
  );

  const aoMover = useCallback(
    (e: React.PointerEvent) => {
      if (!arrastando.current) return;
      atualizarPelaPosicaoX(e.clientX);
    },
    [atualizarPelaPosicaoX]
  );

  const aoSoltar = useCallback(() => {
    arrastando.current = false;
  }, []);

  const aoPressionarTecla = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosicao((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosicao((p) => Math.min(100, p + 5));
  }, []);

  return { referenciaContentor, posicao, aoPressionar, aoMover, aoSoltar, aoPressionarTecla };
}
