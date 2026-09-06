import type { RequisicaoVercel, RespostaVercel } from "../_tipos.js";

const URL_RUNWAY = "https://api.dev.runwayml.com/v1/image_to_video";
const VERSAO_RUNWAY = "2024-11-06";

interface CorpoRequisicao {
  apiKey?: string;
  promptImage?: string;
  promptText?: string;
  ratio?: string;
  duration?: number;
}

// Proxy stateless: repassa a chave BYOK do usuário pra Runway sem persistir
// ou logar em nenhum momento — a Runway não aceita chamadas diretas do
// navegador (sem suporte a CORS), então essa function existe só pra isso.
export default async function handler(req: RequisicaoVercel, res: RespostaVercel) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { apiKey, promptImage, promptText, ratio, duration } = (req.body ?? {}) as CorpoRequisicao;

  if (!apiKey || !promptImage || !ratio || !duration) {
    res.status(400).json({ error: "missing_params" });
    return;
  }

  if (promptImage.length > 6_000_000) {
    res.status(413).json({ error: "image_too_large" });
    return;
  }

  try {
    const respostaRunway = await fetch(URL_RUNWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Runway-Version": VERSAO_RUNWAY,
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptImage,
        promptText: promptText ?? "",
        ratio,
        duration,
      }),
    });

    const corpo = await respostaRunway.json().catch(() => ({}));
    res.status(respostaRunway.status).json(corpo);
  } catch {
    res.status(502).json({ error: "runway_unreachable" });
  }
}
