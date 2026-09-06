// Cliente direto pra fal.ai (LTX Video) — diferente da Runway, a fal.ai
// permite CORS do navegador (confirmado em teste real), então não precisa de
// nenhum proxy serverless: tudo roda client-side com a chave BYOK do usuário.

const URL_UPLOAD_INICIAR = "https://rest.alpha.fal.ai/storage/upload/initiate";
const URL_MODELO = "https://queue.fal.run/fal-ai/ltx-video-13b-distilled/image-to-video";
const FRAME_RATE = 24;

function cabecalhoAutorizacao(apiKey: string): HeadersInit {
  return { Authorization: `Key ${apiKey}` };
}

export interface RespostaStatusFal {
  status?: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED";
  detail?: string;
}

export interface RespostaResultadoFal {
  video?: { url?: string };
  detail?: string;
}

interface RespostaCriarTarefa {
  status: number;
  corpo: { request_id?: string; status_url?: string; response_url?: string; detail?: string };
}

async function lerJson<T>(resposta: Response): Promise<T> {
  return (await resposta.json().catch(() => ({}))) as T;
}

// Sobe a imagem pro storage do fal.ai (o parâmetro image_url do modelo não
// aceita data URI, só URL pública) e devolve a URL final do arquivo.
async function subirImagem(apiKey: string, blob: Blob, nomeArquivo: string): Promise<string> {
  const iniciar = await fetch(URL_UPLOAD_INICIAR, {
    method: "POST",
    headers: { ...cabecalhoAutorizacao(apiKey), "Content-Type": "application/json" },
    body: JSON.stringify({ content_type: blob.type || "image/jpeg", file_name: nomeArquivo }),
  });

  if (!iniciar.ok) {
    throw new Error(`upload_initiate_falhou_${iniciar.status}`);
  }

  const { upload_url, file_url } = await lerJson<{ upload_url?: string; file_url?: string }>(iniciar);
  if (!upload_url || !file_url) throw new Error("upload_initiate_resposta_invalida");

  const envio = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  if (!envio.ok) throw new Error(`upload_put_falhou_${envio.status}`);

  return file_url;
}

export const servicoVideoIA = {
  async criarTarefa(params: {
    apiKey: string;
    imagem: Blob;
    nomeArquivo: string;
    promptText: string;
    duracao: 5 | 10;
  }): Promise<RespostaCriarTarefa> {
    const imageUrl = await subirImagem(params.apiKey, params.imagem, params.nomeArquivo);

    const resposta = await fetch(URL_MODELO, {
      method: "POST",
      headers: { ...cabecalhoAutorizacao(params.apiKey), "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: params.promptText,
        image_url: imageUrl,
        resolution: "720p",
        aspect_ratio: "auto",
        num_frames: params.duracao * FRAME_RATE + 1,
        frame_rate: FRAME_RATE,
      }),
    });

    const corpo = await lerJson<RespostaCriarTarefa["corpo"]>(resposta);
    return { status: resposta.status, corpo };
  },

  async consultarStatus(apiKey: string, statusUrl: string): Promise<{ status: number; corpo: RespostaStatusFal }> {
    const resposta = await fetch(statusUrl, { headers: cabecalhoAutorizacao(apiKey) });
    const corpo = await lerJson<RespostaStatusFal>(resposta);
    return { status: resposta.status, corpo };
  },

  async obterResultado(
    apiKey: string,
    responseUrl: string
  ): Promise<{ status: number; corpo: RespostaResultadoFal }> {
    const resposta = await fetch(responseUrl, { headers: cabecalhoAutorizacao(apiKey) });
    const corpo = await lerJson<RespostaResultadoFal>(resposta);
    return { status: resposta.status, corpo };
  },

  // Testa a chave sem gastar crédito de geração: só tenta iniciar um upload
  // (grátis) e checa se a autenticação passa.
  async validarChave(apiKey: string): Promise<boolean> {
    const resposta = await fetch(URL_UPLOAD_INICIAR, {
      method: "POST",
      headers: { ...cabecalhoAutorizacao(apiKey), "Content-Type": "application/json" },
      body: JSON.stringify({ content_type: "image/jpeg", file_name: "teste.jpg" }),
    });
    return resposta.status !== 401 && resposta.status !== 403;
  },
};
