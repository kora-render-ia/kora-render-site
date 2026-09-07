export interface ErroGoogleIA {
  chave: string;
  parametros?: Record<string, unknown>;
}

function extrairTextoErro(corpo: unknown): string {
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

function mensagemBruta(corpo: unknown): string {
  if (!corpo || typeof corpo !== "object") return "";
  const erro = (corpo as { error?: { message?: unknown } }).error;
  const mensagem = erro?.message;
  return typeof mensagem === "string" ? mensagem.slice(0, 200) : "";
}

type CategoriaErro429 = "billing" | "quota" | "rate_limit" | "spend_limit" | null;

function classificar429(texto: string): CategoriaErro429 {
  if (
    texto.includes("billing") ||
    texto.includes("payment required") ||
    texto.includes("insufficient funds") ||
    texto.includes("insufficient credit") ||
    texto.includes("credit balance") ||
    texto.includes("billing account")
  ) {
    return "billing";
  }
  if (
    texto.includes("quota_exceeded") ||
    texto.includes("quota exceeded") ||
    texto.includes("daily quota") ||
    texto.includes("per day") ||
    texto.includes("requests per day") ||
    texto.includes("rpd") ||
    texto.includes("tokens per day") ||
    texto.includes("tpd")
  ) {
    return "quota";
  }
  if (texto.includes("spend") && (texto.includes("limit") || texto.includes("exceed"))) {
    return "spend_limit";
  }
  if (
    texto.includes("rate_limit_exceeded") ||
    texto.includes("rate limit") ||
    texto.includes("too many requests") ||
    texto.includes("requests per minute") ||
    texto.includes("tokens per minute") ||
    texto.includes("requests per second") ||
    texto.includes("rpm") ||
    texto.includes("tpm")
  ) {
    return "rate_limit";
  }
  return null;
}

// Devolve a CHAVE i18n (+ parâmetros de interpolação quando a mensagem
// precisa de um trecho dinâmico) — nunca o texto final, pra quem chamar
// decidir o idioma.
export function mapearErroGoogleIA(status: number, corpo: unknown): ErroGoogleIA {
  const texto = extrairTextoErro(corpo);

  if (status === 400) {
    if (texto.includes("api_key") || texto.includes("api key")) {
      return { chave: "conta.renderizar.erros.chaveInvalida" };
    }
    if (texto.includes("safety") || texto.includes("blocked")) {
      return { chave: "conta.renderizar.erros.bloqueadoSeguranca" };
    }
    return { chave: "conta.renderizar.erros.requisicaoInvalida", parametros: { msg: mensagemBruta(corpo) } };
  }

  if (status === 401 || status === 403) {
    return { chave: "conta.renderizar.erros.chaveInvalida" };
  }

  if (status === 402) {
    return { chave: "conta.renderizar.erros.semCredito" };
  }

  if (status === 429) {
    const categoria = classificar429(texto);
    if (categoria === "billing" || categoria === "spend_limit") {
      return { chave: "conta.renderizar.erros.semCreditoLimiteGastos" };
    }
    if (categoria === "quota") {
      return { chave: "conta.renderizar.erros.quotaEsgotada" };
    }
    return { chave: "conta.renderizar.erros.limiteTaxa" };
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return { chave: "conta.renderizar.erros.instavel" };
  }

  return { chave: "conta.renderizar.erros.erroHttp", parametros: { codigo: status, msg: mensagemBruta(corpo) } };
}

export const CODIGOS_RETRYABLE_CATALOGO = [0, 429, 500, 502, 503, 504];
export const CODIGOS_RETRYABLE_RENDER = [429, 503];
export const CODIGOS_FALLBACK_MODELO = [404, 429, 503];

// Erros de billing/quota nunca devem ser retentados — retentar não muda o
// resultado e só atrasa a mensagem de erro pro usuário.
export function erroNaoRetryable(corpo: unknown): boolean {
  const texto = extrairTextoErro(corpo);
  const categoria = classificar429(texto);
  return categoria === "billing" || categoria === "spend_limit" || categoria === "quota";
}
