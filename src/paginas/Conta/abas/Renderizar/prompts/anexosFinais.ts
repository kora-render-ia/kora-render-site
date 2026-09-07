import { buildDefinicaoVista } from "./vistaJanela";
import { tipoEhExterior } from "../dados/opcoesRenderizacao";
import type { ParametrosRender } from "../tipos";

// Seção 6.13 — anexa ao final de AMBOS os systems (Pro e Flash). Vista pela
// janela só se aplica a interior; fontes de luz marcadas e 360 fidelity lock
// dependem do modelo 3D do SketchUp — não aplicável no site, omitidos.
export function anexarBlocosFinais(systemBase: string, parametros: ParametrosRender): string {
  if (tipoEhExterior(parametros.tipo) || parametros.vista === "nenhum") {
    return systemBase;
  }

  const blocoVista = buildDefinicaoVista(parametros.vista);
  return `${systemBase}\n\nWINDOW VIEW (paint ONLY beyond the glass, never touch the room):${blocoVista}`;
}
