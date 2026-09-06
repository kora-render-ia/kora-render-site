function extrairMensagem(corpo: unknown): string {
  if (!corpo || typeof corpo !== "object") return "";
  const mensagem = (corpo as { detail?: unknown }).detail;
  return typeof mensagem === "string" ? mensagem.toLowerCase() : "";
}

// Devolve a CHAVE i18n (não o texto), pra quem chamar decidir o idioma.
// Nunca deixa um status desconhecido passar sem mapear — evita o polling
// continuar pra sempre quando a resposta é inesperada.
export function mapearErroVideoIA(status: number, corpo: unknown): string {
  const mensagem = extrairMensagem(corpo);

  if (status === 401 || status === 403 || mensagem.includes("authoriz") || mensagem.includes("api key")) {
    return "conta.videos.erros.chaveInvalida";
  }
  if (status === 402 || mensagem.includes("insufficient") || mensagem.includes("balance") || mensagem.includes("credit")) {
    return "conta.videos.erros.creditosInsuficientes";
  }
  if (status === 429 || mensagem.includes("rate limit")) {
    return "conta.videos.erros.limiteAtingido";
  }
  return "conta.videos.erros.erroGenerico";
}

export type ResultadoStatusFal = "sucesso" | "em_andamento" | "falha";

// Qualquer status fora do conjunto conhecido cai em "falha" — nunca deixa o
// polling continuar indefinidamente por causa de uma resposta inesperada.
export function classificarStatusFal(status: unknown): ResultadoStatusFal {
  if (status === "COMPLETED") return "sucesso";
  if (status === "IN_QUEUE" || status === "IN_PROGRESS") return "em_andamento";
  return "falha";
}
