const TIPOS_MIME_ACEITOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const EXTENSOES_ACEITAS = [".jpg", ".jpeg", ".png", ".webp"];

// Cobre com folga o maior caso citado no requisito (8192x4096 ≈ 33,5 MP);
// acima disso arriscamos travar o decode da imagem ou a textura WebGL.
export const LIMITE_MEGAPIXELS = 40_000_000;
export const LIMITE_TAMANHO_ARQUIVO_BYTES = 60 * 1024 * 1024;

// Tolerância em torno de 2:1 — panoramas equiretangulares reais raramente
// batem o valor exato por causa de crops/compressão.
const TOLERANCIA_PROPORCAO_PANORAMICA = 0.15;

export function arquivoEhImagemSuportada(arquivo: File): boolean {
  if (TIPOS_MIME_ACEITOS.includes(arquivo.type.toLowerCase())) return true;
  const nome = arquivo.name.toLowerCase();
  return EXTENSOES_ACEITAS.some((extensao) => nome.endsWith(extensao));
}

export function lerDimensoesImagem(url: string): Promise<{ largura: number; altura: number }> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => {
      resolve({ largura: imagem.naturalWidth, altura: imagem.naturalHeight });
    };
    imagem.onerror = () => reject(new Error("Não foi possível ler as dimensões da imagem."));
    imagem.src = url;
  });
}

export function proporcaoForaDoPadraoPanoramico(largura: number, altura: number): boolean {
  if (!largura || !altura) return false;
  const proporcao = largura / altura;
  return Math.abs(proporcao - 2) > TOLERANCIA_PROPORCAO_PANORAMICA;
}
