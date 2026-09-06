import type { ItemHistoricoVideo } from "../tipos";

const CHAVE_API_KEY = "kr_fal_api_key";
const CHAVE_HISTORICO = "kr_video_historico";
const LIMITE_HISTORICO = 20;

export function obterChaveVideoIA(): string | null {
  return localStorage.getItem(CHAVE_API_KEY);
}

export function salvarChaveVideoIA(chave: string): void {
  localStorage.setItem(CHAVE_API_KEY, chave);
}

export function removerChaveVideoIA(): void {
  localStorage.removeItem(CHAVE_API_KEY);
}

export function obterHistoricoVideos(): ItemHistoricoVideo[] {
  try {
    const bruto = localStorage.getItem(CHAVE_HISTORICO);
    if (!bruto) return [];
    const itens = JSON.parse(bruto);
    return Array.isArray(itens) ? itens : [];
  } catch {
    return [];
  }
}

export function adicionarAoHistoricoVideos(item: ItemHistoricoVideo): ItemHistoricoVideo[] {
  const atualizado = [item, ...obterHistoricoVideos()].slice(0, LIMITE_HISTORICO);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(atualizado));
  return atualizado;
}

export function removerDoHistoricoVideos(id: string): ItemHistoricoVideo[] {
  const atualizado = obterHistoricoVideos().filter((item) => item.id !== id);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(atualizado));
  return atualizado;
}
