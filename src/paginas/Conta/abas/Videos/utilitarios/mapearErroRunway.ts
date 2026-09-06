function extrairMensagem(corpo: unknown): string {
  if (!corpo || typeof corpo !== "object") return "";
  const erro = (corpo as { error?: unknown }).error;
  if (typeof erro === "string") return erro.toLowerCase();
  if (erro && typeof erro === "object") {
    const mensagem = (erro as { message?: unknown }).message;
    if (typeof mensagem === "string") return mensagem.toLowerCase();
  }
  return "";
}

// Devolve a CHAVE i18n (não o texto), pra quem chamar decidir o idioma.
// Nunca deixa um status desconhecido passar sem mapear — evita o bug do
// polling que nunca termina quando a Runway devolve algo inesperado.
export function mapearErroRunway(status: number, corpo: unknown): string {
  const mensagem = extrairMensagem(corpo);

  if (status === 401 || mensagem.includes("unauthorized") || mensagem.includes("invalid api key")) {
    return "conta.videos.erros.chaveInvalida";
  }
  if (status === 402 || mensagem.includes("insufficient") || mensagem.includes("credit")) {
    return "conta.videos.erros.creditosInsuficientes";
  }
  if (status === 429) {
    return "conta.videos.erros.limiteAtingido";
  }
  return "conta.videos.erros.erroGenerico";
}

export type ResultadoStatusRunway = "sucesso" | "em_andamento" | "falha";

// Qualquer status fora do conjunto conhecido cai em "falha" — nunca deixa o
// polling continuar indefinidamente por causa de uma resposta inesperada.
export function classificarStatusRunway(status: unknown): ResultadoStatusRunway {
  if (status === "SUCCEEDED") return "sucesso";
  if (status === "PENDING" || status === "THROTTLED" || status === "RUNNING") return "em_andamento";
  return "falha";
}
