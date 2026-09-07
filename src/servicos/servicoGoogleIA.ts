// Cliente direto pra API do Google Generative Language (Gemini) — CORS
// aberto (confirmado em teste real), então roda 100% client-side com a
// chave BYOK do usuário, sem nenhum proxy serverless. Espelha o padrão já
// usado em servicoVideoIA.ts (fal.ai).

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODELO_CATALOGO = "gemini-2.5-flash";
const MODELO_RENDER_PRO = "gemini-3-pro-image-preview";
const MODELO_RENDER_FLASH = "gemini-3.1-flash-image";

const NOME_EXIBIDO_MODELO: Record<string, string> = {
  [MODELO_RENDER_PRO]: "Nano Banana Pro",
  [MODELO_RENDER_FLASH]: "Nano Banana 2",
};

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

const CODIGOS_RETRYABLE_CATALOGO = [0, 429, 500, 502, 503, 504];
const CODIGOS_RETRYABLE_RENDER = [429, 503];
const CODIGOS_FALLBACK_MODELO = [404, 429, 503];
const BACKOFFS_MS = [5000, 15000];

export interface ParteConteudo {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface RespostaGemini {
  status: number;
  corpo: {
    candidates?: {
      content?: { parts?: { text?: string; inlineData?: { mimeType?: string; data?: string } }[] };
      finishReason?: string;
    }[];
    error?: { message?: string; status?: string; code?: number; details?: unknown };
  };
}

function extrairMensagem(corpo: unknown): string {
  if (!corpo || typeof corpo !== "object") return "";
  const erro = (corpo as { error?: unknown }).error;
  if (!erro || typeof erro !== "object") return "";
  const { message, status, code, details } = erro as Record<string, unknown>;
  return [message, status, code, details]
    .filter((parte) => parte !== undefined && parte !== null)
    .map((parte) => (typeof parte === "string" ? parte : JSON.stringify(parte)))
    .join(" ")
    .toLowerCase();
}

// Erros de billing/quota nunca devem ser retentados — retentar não muda o
// resultado e só atrasa a mensagem de erro pro usuário.
function erroNaoRetryable(corpo: unknown): boolean {
  const texto = extrairMensagem(corpo);
  const ehBilling =
    texto.includes("billing") ||
    texto.includes("payment required") ||
    texto.includes("insufficient funds") ||
    texto.includes("insufficient credit") ||
    texto.includes("credit balance") ||
    texto.includes("billing account");
  const ehSpendLimit = texto.includes("spend") && (texto.includes("limit") || texto.includes("exceed"));
  const ehQuota =
    texto.includes("quota_exceeded") ||
    texto.includes("quota exceeded") ||
    texto.includes("daily quota") ||
    texto.includes("requests per day") ||
    texto.includes("tokens per day");
  return ehBilling || ehSpendLimit || ehQuota;
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function comJitter(ms: number): number {
  const variacao = ms * 0.2;
  return ms + (Math.random() * 2 - 1) * variacao;
}

async function chamarGemini(modelo: string, chave: string, corpoRequisicao: object): Promise<RespostaGemini> {
  try {
    const resposta = await fetch(`${BASE_URL}/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify(corpoRequisicao),
    });
    const corpo = await resposta.json().catch(() => ({}));
    return { status: resposta.status, corpo };
  } catch {
    // Falha de rede/timeout — representada como status 0, igual à spec.
    return { status: 0, corpo: {} };
  }
}

async function chamarComRetry(
  modelo: string,
  chave: string,
  corpoRequisicao: object,
  tentativasMax: number,
  codigosRetryable: number[]
): Promise<RespostaGemini> {
  let tentativa = 0;
  let ultima: RespostaGemini;

  do {
    ultima = await chamarGemini(modelo, chave, corpoRequisicao);
    if (ultima.status >= 200 && ultima.status < 300) return ultima;
    if (erroNaoRetryable(ultima.corpo)) return ultima;
    if (!codigosRetryable.includes(ultima.status)) return ultima;

    tentativa++;
    if (tentativa >= tentativasMax) return ultima;
    await aguardar(comJitter(BACKOFFS_MS[Math.min(tentativa - 1, BACKOFFS_MS.length - 1)]));
  } while (tentativa < tentativasMax);

  return ultima;
}

export interface ResultadoCatalogo {
  status: number;
  corpo: RespostaGemini["corpo"];
  texto: string | null;
}

// Etapa 1 — até 2 tentativas, retry em [0,429,500,502,503,504].
export async function gerarCatalogo(
  chave: string,
  base64Png: string,
  prompt: { system: string; user: string }
): Promise<ResultadoCatalogo> {
  const corpoRequisicao = {
    systemInstruction: { parts: [{ text: prompt.system }] },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt.user }, { inlineData: { mimeType: "image/png", data: base64Png } }],
      },
    ],
    generationConfig: { temperature: 0.0, topP: 0.1, topK: 1, mediaResolution: "MEDIA_RESOLUTION_HIGH" },
    safetySettings: SAFETY_SETTINGS,
  };

  const { status, corpo } = await chamarComRetry(MODELO_CATALOGO, chave, corpoRequisicao, 2, CODIGOS_RETRYABLE_CATALOGO);
  const texto = corpo.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  return { status, corpo, texto };
}

// O system prompt e as parts extras mudam conforme o modelo sendo chamado
// (Pro usa o system completo; Flash usa o system enxuto + blocos de texto
// extras nas parts) — por isso "montar" é chamado de novo pra cada modelo
// tentado (primário e, se precisar, o fallback), nunca reaproveitado entre os dois.
export interface OpcoesGeracaoImagem {
  montar: (modelo: string) => { system: string; parts: ParteConteudo[]; temPedidoPessoa: boolean };
  modeloIa: "pro" | "banana2";
  qualidade: "2K" | "4K";
  proporcao: string;
}

export interface ResultadoImagem {
  status: number;
  corpo: RespostaGemini["corpo"];
  imagemBase64: string | null;
  mimeType: string;
  largura: number | null;
  altura: number | null;
  avisoFallback: string | null;
  avisoResolucao: string | null;
}

function modeloPrimarioEFallback(modeloIa: "pro" | "banana2"): { primario: string; fallback: string } {
  return modeloIa === "pro"
    ? { primario: MODELO_RENDER_PRO, fallback: MODELO_RENDER_FLASH }
    : { primario: MODELO_RENDER_FLASH, fallback: MODELO_RENDER_PRO };
}

function larguraAlturaPng(base64: string): { largura: number; altura: number } | null {
  try {
    const binario = atob(base64.slice(0, 200));
    const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
    // Assinatura PNG (8 bytes) + chunk IHDR: 4 bytes de tamanho + "IHDR" (4) +
    // largura (4 bytes big-endian) + altura (4 bytes big-endian).
    const vista = new DataView(bytes.buffer);
    const largura = vista.getUint32(16);
    const altura = vista.getUint32(20);
    return { largura, altura };
  } catch {
    return null;
  }
}

async function chamarModeloImagem(
  modelo: string,
  chave: string,
  system: string,
  parts: ParteConteudo[],
  qualidade: "2K" | "4K",
  proporcao: string,
  temPedidoPessoa: boolean,
  tentativasMax: number,
  codigosRetryable: number[]
): Promise<RespostaGemini> {
  const corpoRequisicao = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: temPedidoPessoa ? 0.85 : 0.0,
      topP: temPedidoPessoa ? 0.95 : 0.1,
      topK: 1,
      responseModalities: ["IMAGE"],
      imageConfig: { imageSize: qualidade, aspectRatio: proporcao },
    },
    safetySettings: SAFETY_SETTINGS,
  };

  return chamarComRetry(modelo, chave, corpoRequisicao, tentativasMax, codigosRetryable);
}

// Etapa 3 — até 3 tentativas no modelo primário (retry só em [429,503] —
// nunca em 500/502/504/timeout, porque o Google pode já ter gerado e cobrado
// a imagem antes da resposta se perder). Se falhar com [404,429,503], tenta
// o modelo alternativo (2 tentativas, mesmo critério de retry).
export async function gerarImagem(chave: string, opcoes: OpcoesGeracaoImagem): Promise<ResultadoImagem> {
  const { primario, fallback } = modeloPrimarioEFallback(opcoes.modeloIa);

  const montoPrimario = opcoes.montar(primario);
  let resposta = await chamarModeloImagem(
    primario,
    chave,
    montoPrimario.system,
    montoPrimario.parts,
    opcoes.qualidade,
    opcoes.proporcao,
    montoPrimario.temPedidoPessoa,
    3,
    CODIGOS_RETRYABLE_RENDER
  );

  let avisoFallback: string | null = null;

  if (!(resposta.status >= 200 && resposta.status < 300) && CODIGOS_FALLBACK_MODELO.includes(resposta.status)) {
    const montoFallback = opcoes.montar(fallback);
    const respostaFallback = await chamarModeloImagem(
      fallback,
      chave,
      montoFallback.system,
      montoFallback.parts,
      opcoes.qualidade,
      opcoes.proporcao,
      montoFallback.temPedidoPessoa,
      2,
      CODIGOS_RETRYABLE_RENDER
    );
    if (respostaFallback.status >= 200 && respostaFallback.status < 300) {
      avisoFallback = `Gerado com ${NOME_EXIBIDO_MODELO[fallback]} — ${NOME_EXIBIDO_MODELO[primario]} estava indisponível no momento.`;
      resposta = respostaFallback;
    } else {
      resposta = respostaFallback;
    }
  }

  const parteImagem = resposta.corpo.candidates?.[0]?.content?.parts?.find((parte) => parte.inlineData);
  const imagemBase64 = parteImagem?.inlineData?.data ?? null;
  const mimeType = parteImagem?.inlineData?.mimeType ?? "image/png";

  let avisoResolucao: string | null = null;
  let largura: number | null = null;
  let altura: number | null = null;
  if (imagemBase64) {
    const dimensoes = larguraAlturaPng(imagemBase64);
    if (dimensoes) {
      largura = dimensoes.largura;
      altura = dimensoes.altura;
      const limite = opcoes.qualidade === "4K" ? 2400 : 1400;
      const maiorLado = Math.max(dimensoes.largura, dimensoes.altura);
      if (maiorLado < limite) {
        avisoResolucao = `A imagem veio em resolução menor que a pedida (${dimensoes.largura}x${dimensoes.altura} em vez de ${opcoes.qualidade}) — o modelo alternativo às vezes ignora a resolução solicitada.`;
      }
    }
  }

  return { status: resposta.status, corpo: resposta.corpo, imagemBase64, mimeType, largura, altura, avisoFallback, avisoResolucao };
}

// Testa a chave sem custo: lista os modelos disponíveis. 200 = válida,
// 400/401/403 = inválida, qualquer outro status (ex. 429 rate-limited) =
// válida mas indisponível no momento.
export async function validarChaveGoogleIA(chave: string): Promise<boolean> {
  try {
    const resposta = await fetch(`${BASE_URL}/models`, { headers: { "x-goog-api-key": chave } });
    return resposta.status !== 400 && resposta.status !== 401 && resposta.status !== 403;
  } catch {
    return false;
  }
}
