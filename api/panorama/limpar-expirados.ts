import { list, del } from "@vercel/blob";
import type { RequisicaoVercel, RespostaVercel } from "../_tipos.js";

const DIAS_EXPIRACAO = 30;
const PREFIXO_PANORAMAS = "panoramas/";

// Disparada 1x/dia pelo Cron Job configurado em vercel.json. Apaga panoramas
// compartilhados com mais de 30 dias — evita que o Blob (5 GB grátis no
// Hobby) encha com links antigos que ninguém mais usa. O header
// "Authorization: Bearer $CRON_SECRET" é enviado automaticamente pela Vercel
// em chamadas de cron; sem ele, qualquer um poderia acionar o endpoint.
export default async function handler(req: RequisicaoVercel, res: RespostaVercel) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const limiteExpiracao = Date.now() - DIAS_EXPIRACAO * 24 * 60 * 60 * 1000;
  const urlsParaApagar: string[] = [];
  let cursor: string | undefined;

  try {
    do {
      const pagina = await list({ prefix: PREFIXO_PANORAMAS, cursor, limit: 1000 });
      for (const blob of pagina.blobs) {
        if (blob.uploadedAt.getTime() < limiteExpiracao) urlsParaApagar.push(blob.url);
      }
      cursor = pagina.hasMore ? pagina.cursor : undefined;
    } while (cursor);

    if (urlsParaApagar.length > 0) {
      await del(urlsParaApagar);
    }

    res.status(200).json({ apagados: urlsParaApagar.length });
  } catch (erro) {
    res.status(500).json({ error: (erro as Error).message });
  }
}
