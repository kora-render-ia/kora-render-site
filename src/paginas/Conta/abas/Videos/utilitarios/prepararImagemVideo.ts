const LADO_MAIOR_MAXIMO = 1280;
const LADO_MENOR_MINIMO = 300;
const QUALIDADE_JPEG = 0.92;

const TIPOS_MIME_ACEITOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const EXTENSOES_ACEITAS = [".jpg", ".jpeg", ".png", ".webp"];

export function arquivoEhImagemSuportada(arquivo: File): boolean {
  if (TIPOS_MIME_ACEITOS.includes(arquivo.type.toLowerCase())) return true;
  const nome = arquivo.name.toLowerCase();
  return EXTENSOES_ACEITAS.some((extensao) => nome.endsWith(extensao));
}

interface ImagemPreparada {
  dataUrl: string;
  largura: number;
  altura: number;
}

function carregarImagem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    imagem.src = url;
  });
}

// Redimensiona (lado maior ≤1280px, lado menor ≥300px, mantendo proporção),
// converte pra JPEG e devolve as dimensões FINAIS (pós-conversão) — usadas
// depois pra escolher o ratio mais próximo aceito pela Runway.
export async function prepararImagemVideo(arquivo: File): Promise<ImagemPreparada> {
  const urlOriginal = URL.createObjectURL(arquivo);

  try {
    const imagem = await carregarImagem(urlOriginal);
    const larguraOriginal = imagem.naturalWidth;
    const alturaOriginal = imagem.naturalHeight;

    const ladoMaiorOriginal = Math.max(larguraOriginal, alturaOriginal);
    const ladoMenorOriginal = Math.min(larguraOriginal, alturaOriginal);

    let fator = 1;
    if (ladoMaiorOriginal > LADO_MAIOR_MAXIMO) {
      fator = LADO_MAIOR_MAXIMO / ladoMaiorOriginal;
    } else if (ladoMenorOriginal < LADO_MENOR_MINIMO && ladoMenorOriginal > 0) {
      fator = LADO_MENOR_MINIMO / ladoMenorOriginal;
    }

    const largura = Math.max(1, Math.round(larguraOriginal * fator));
    const altura = Math.max(1, Math.round(alturaOriginal * fator));

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("Não foi possível processar esta imagem.");
    contexto.drawImage(imagem, 0, 0, largura, altura);

    const dataUrl = canvas.toDataURL("image/jpeg", QUALIDADE_JPEG);
    return { dataUrl, largura, altura };
  } finally {
    URL.revokeObjectURL(urlOriginal);
  }
}
