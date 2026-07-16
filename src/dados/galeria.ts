import type { ItemGaleria } from "../tipos";
import cozinha1 from "../ativos/imagens/galeria/cozinha-1.png";
import sala1 from "../ativos/imagens/galeria/sala-1.png";
import fachada1 from "../ativos/imagens/galeria/fachada-1.png";
import quarto1 from "../ativos/imagens/galeria/quarto-1.png";
import externa1 from "../ativos/imagens/galeria/externa-1.png";
import banheiro1 from "../ativos/imagens/galeria/banheiro-1.jpg";

export const idsCategoriasGaleria = [
  "todos",
  "salas",
  "cozinhas",
  "quartos",
  "banheiros",
  "fachadas",
  "areas-externas",
] as const;

export const itensGaleria: ItemGaleria[] = [
  { id: "galeria-cozinha-1", imagem: cozinha1, categoria: "cozinhas" },
  { id: "galeria-sala-1", imagem: sala1, categoria: "salas" },
  { id: "galeria-fachada-1", imagem: fachada1, categoria: "fachadas" },
  { id: "galeria-quarto-1", imagem: quarto1, categoria: "quartos" },
  { id: "galeria-externa-1", imagem: externa1, categoria: "areas-externas" },
  { id: "galeria-banheiro-1", imagem: banheiro1, categoria: "banheiros" },
];
