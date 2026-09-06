import type { IncomingMessage, ServerResponse } from "node:http";

// Tipos mínimos do runtime Node das Vercel Functions — evita depender do
// pacote @vercel/node (árvore de dependências pesada) só por essas 2 formas.
// Prefixo "_" faz a Vercel ignorar este arquivo como rota.
export interface RequisicaoVercel extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
  body: unknown;
}

export interface RespostaVercel extends ServerResponse {
  status(codigo: number): RespostaVercel;
  json(corpo: unknown): void;
}
