import type { ReactNode, MouseEventHandler } from "react";

export type VarianteBotao = "primario" | "secundario" | "fantasma";
export type TamanhoBotao = "sm" | "md" | "lg";

export interface PropriedadesBotao {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  href?: string;
  icone?: ReactNode;
  posicaoIcone?: "esquerda" | "direita";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  desabilitado?: boolean;
  aoClicar?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  "aria-label"?: string;
}
