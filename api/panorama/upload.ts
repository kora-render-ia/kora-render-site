import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { RequisicaoVercel, RespostaVercel } from "../_tipos.js";

const TIPOS_ACEITOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const LIMITE_TAMANHO_ARQUIVO_BYTES = 60 * 1024 * 1024;

// Gera o token de upload direto-do-navegador pro Vercel Blob (o arquivo vai
// do cliente pro storage sem passar pelo corpo desta function — necessário
// porque panoramas podem passar dos ~4,5 MB de limite de payload das
// Vercel Functions). O link resultante é público e permanente: qualquer
// pessoa com a URL abre o panorama, sem precisar de conta.
export default async function handler(req: RequisicaoVercel, res: RespostaVercel) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  try {
    const resultado = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: TIPOS_ACEITOS,
        maximumSizeInBytes: LIMITE_TAMANHO_ARQUIVO_BYTES,
        addRandomSuffix: true,
      }),
    });
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(400).json({ error: (erro as Error).message });
  }
}
