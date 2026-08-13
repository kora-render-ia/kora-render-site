import imagemAntes from "../ativos/imagens/antes-sketchup.png";
import imagemDepois from "../ativos/imagens/depois-render.png";
import imagemAntes1 from "../ativos/imagens/quarto-antes.png";
import imagemDepois1 from "../ativos/imagens/quarto-depois.png";
import imagemAntes2 from "../ativos/imagens/sala-casa-praia-antes.png";
import imagemDepois2 from "../ativos/imagens/sala-casa-praia-depois.png";
import imagemAntes3 from "../ativos/imagens/casa-concreto-antes.png";
import imagemDepois3 from "../ativos/imagens/casa-concreto-depois.png";

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
