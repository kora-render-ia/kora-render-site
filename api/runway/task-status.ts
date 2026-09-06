import type { RequisicaoVercel, RespostaVercel } from "../_tipos.js";

const URL_BASE_RUNWAY = "https://api.dev.runwayml.com/v1/tasks";
const VERSAO_RUNWAY = "2024-11-06";

// Proxy stateless de consulta de status. A chave vem sempre pelo header
// Authorization (nunca por query string) pra não ficar registrada em logs
// de acesso. Usado tanto pelo polling da geração quanto pra validar uma
// chave nova (consultando um UUID inventado: 401 = chave inválida).
export default async function handler(req: RequisicaoVercel, res: RespostaVercel) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const taskId = req.query.taskId;

  if (!apiKey || typeof taskId !== "string" || !taskId) {
    res.status(400).json({ error: "missing_params" });
    return;
  }

  try {
    const respostaRunway = await fetch(`${URL_BASE_RUNWAY}/${encodeURIComponent(taskId)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Runway-Version": VERSAO_RUNWAY,
      },
    });

    const corpo = await respostaRunway.json().catch(() => ({}));
    res.status(respostaRunway.status).json(corpo);
  } catch {
    res.status(502).json({ error: "runway_unreachable" });
  }
}
