import type { Proporcao } from "../tipos";
import type { InfoImagemRender } from "../tipos";

const LADO_MAIOR_ALVO = 3072;
const FATOR_UPSCALE_MAXIMO = 2;

const TIPOS_MIME_ACEITOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const EXTENSOES_ACEITAS = [".jpg", ".jpeg", ".png", ".webp"];

export function arquivoEhImagemSuportada(arquivo: File): boolean {
  if (TIPOS_MIME_ACEITOS.includes(arquivo.type.toLowerCase())) return true;
  const nome = arquivo.name.toLowerCase();
  return EXTENSOES_ACEITAS.some((extensao) => nome.endsWith(extensao));
}

function carregarImagem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    imagem.src = url;
  });
}

function proporcaoParaRazao(proporcao: Proporcao): number {
  const [largura, altura] = proporcao.split(":").map(Number);
  return largura / altura;
}

// Recorta o centro da imagem pra bater com a proporção pedida — nunca
// distorce/espreme, sempre corta a sobra de um dos eixos.
function calcularCropCentral(larguraOriginal: number, alturaOriginal: number, razaoAlvo: number) {
  const razaoOriginal = larguraOriginal / alturaOriginal;

  let larguraCrop = larguraOriginal;
  let alturaCrop = alturaOriginal;

  if (razaoOriginal > razaoAlvo) {
    larguraCrop = Math.round(alturaOriginal * razaoAlvo);
  } else if (razaoOriginal < razaoAlvo) {
    alturaCrop = Math.round(larguraOriginal / razaoAlvo);
  }

  const origemX = Math.round((larguraOriginal - larguraCrop) / 2);
  const origemY = Math.round((alturaOriginal - alturaCrop) / 2);

  return { origemX, origemY, larguraCrop, alturaCrop };
}

// Crop central pra proporção pedida + redimensiona pro lado maior ficar perto
// de 3072px (upscale permitido até 2x, nunca faz downscale abaixo do
// necessário) + converte pra PNG (lossless — mantém detalhe fino de bordas
// e texturas que o JPEG perderia). Devolve tanto o data URL (preview) quanto
// o base64 puro (pronto pro inlineData da API do Gemini).
export async function prepararImagemRender(arquivo: File, proporcao: Proporcao): Promise<InfoImagemRender> {
  const urlOriginal = URL.createObjectURL(arquivo);

  try {
    const imagem = await carregarImagem(urlOriginal);
    const razaoAlvo = proporcaoParaRazao(proporcao);
    const { origemX, origemY, larguraCrop, alturaCrop } = calcularCropCentral(
      imagem.naturalWidth,
      imagem.naturalHeight,
      razaoAlvo
    );

    const maiorLadoCrop = Math.max(larguraCrop, alturaCrop);
    const fatorNecessario = LADO_MAIOR_ALVO / maiorLadoCrop;
    const fatorAplicado = Math.min(fatorNecessario, FATOR_UPSCALE_MAXIMO);

    const largura = Math.max(1, Math.round(larguraCrop * fatorAplicado));
    const altura = Math.max(1, Math.round(alturaCrop * fatorAplicado));

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("Não foi possível processar esta imagem.");
    contexto.drawImage(imagem, origemX, origemY, larguraCrop, alturaCrop, 0, 0, largura, altura);

    const dataUrl = canvas.toDataURL("image/png");
    const base64Png = dataUrl.split(",")[1] ?? "";

    return { dataUrl, base64Png, nomeArquivo: arquivo.name, largura, altura };
  } finally {
    URL.revokeObjectURL(urlOriginal);
  }
}
