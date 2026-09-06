import { upload } from "@vercel/blob/client";

const ROTA_UPLOAD = "/api/panorama/upload";

function extensaoDoArquivo(nomeArquivo: string): string {
  const partes = nomeArquivo.split(".");
  return partes.length > 1 ? partes.pop()! : "jpg";
}

// Sobe o panorama pro Vercel Blob direto do navegador (o arquivo nunca passa
// pelo corpo da Vercel Function — só o token de upload) e devolve a URL
// pública e permanente do arquivo, pronta pra virar um link de compartilhamento.
export async function compartilharPanorama(arquivo: File): Promise<string> {
  const nomeUnico = `panoramas/${crypto.randomUUID()}.${extensaoDoArquivo(arquivo.name)}`;
  const resultado = await upload(nomeUnico, arquivo, {
    access: "public",
    handleUploadUrl: ROTA_UPLOAD,
  });
  return resultado.url;
}
