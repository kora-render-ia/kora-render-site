import { PROMPT_PADRAO_VIDEO } from "../dados/catalogoPillsMovimento";
import type { PillMovimento } from "../tipos";

export function montarPromptVideo(textoLivre: string, pillsSelecionadas: PillMovimento[]): string {
  const frases = pillsSelecionadas.map((pill) => pill.frase);
  const prompt = `${textoLivre.trim()} ${frases.join(" ")}`.trim();
  return prompt || PROMPT_PADRAO_VIDEO;
}
