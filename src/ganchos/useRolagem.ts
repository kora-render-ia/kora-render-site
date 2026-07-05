import { useEffect, useState } from "react";

/**
 * Retorna true quando a página ultrapassa `limite` pixels de rolagem.
 * Usado para alternar o estilo da barra de navegação.
 */
export function useRolagem(limite = 16): boolean {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const verificar = () => setRolou(window.scrollY > limite);
    verificar();
    window.addEventListener("scroll", verificar, { passive: true });
    return () => window.removeEventListener("scroll", verificar);
  }, [limite]);

  return rolou;
}
