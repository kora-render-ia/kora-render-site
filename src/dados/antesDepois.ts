import imagemAntes from "../ativos/imagens/antes-sketchup.webp";
import imagemDepois from "../ativos/imagens/depois-render.webp";
import imagemAntes1 from "../ativos/imagens/quarto-antes.webp";
import imagemDepois1 from "../ativos/imagens/quarto-depois.webp";
import imagemAntes2 from "../ativos/imagens/sala-casa-praia-antes.webp";
import imagemDepois2 from "../ativos/imagens/sala-casa-praia-depois.webp";
import imagemAntes3 from "../ativos/imagens/casa-concreto-antes.webp";
import imagemDepois3 from "../ativos/imagens/casa-concreto-depois.webp";
import closeUpPiscina1 from "../ativos/imagens/closeup-piscina-1.webp";
import closeUpPiscina2 from "../ativos/imagens/closeup-piscina-2.webp";

export const imagensAntesDepois = {
  antes: imagemAntes,
  depois: imagemDepois,
};

// Substitua cada par abaixo pelos seus próprios exemplos de render (antes/depois).
// "proporcao" deve refletir o aspect ratio real das imagens, para não cortar nada.
export const exemplosAntesDepois = [
  { antes: imagemAntes1, depois: imagemDepois1, proporcao: "4/3" },
  { antes: imagemAntes2, depois: imagemDepois2, proporcao: "1/1" },
  { antes: imagemAntes3, depois: imagemDepois3, proporcao: "4/3" },
];

// Close-ups reais de detalhes da cena do destaque.
export const closeUpsDestaque = [closeUpPiscina1, closeUpPiscina2];
