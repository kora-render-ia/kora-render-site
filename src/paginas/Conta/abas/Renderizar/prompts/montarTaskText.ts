import type { ParametrosRender } from "../tipos";

// Seção 6.1
export function buildProjectContext(parametros: ParametrosRender): string {
  const linhas: string[] = [];

  linhas.push(`- Project type: ${parametros.tipo}`);

  if (parametros.hora && parametros.hora !== "sem luz natural") {
    linhas.push(`- Time of day / lighting: ${parametros.hora}`);
    linhas.push(`- Lighting style: editorial architectural photography lighting`);
  } else if (parametros.hora === "sem luz natural") {
    linhas.push(`- Lighting: indoor artificial light only, no natural light from windows`);
  }

  if (parametros.temperatura && parametros.temperatura !== "desligado") {
    linhas.push(
      `- Artificial lights: ON at ${parametros.temperatura} — every visible fixture (pendants, sconces, table lamps, floor lamps, recessed downlights, LED strips, ceiling lights) must be glowing and emitting light in the final render, even though the SketchUp viewport shows them off`
    );
  } else {
    linhas.push(`- Artificial lights: OFF — fixtures appear as physical objects only, no glow, no emission`);
  }

  linhas.push(`- Output aspect ratio: ${parametros.proporcao}`);
  linhas.push(`- Output resolution: ${parametros.qualidade}`);

  return linhas.join("\n");
}

// Seção 6.2
export function buildTaskText(catalogo: string, projectContext: string): string {
  return `INPUT_IMAGE: [imagem_da_viewport.png]
FORENSIC_CATALOG:
${catalogo}

PROJECT CONTEXT (overrides any contradictory information in the catalog or viewport — the catalog describes the FORM of the scene, this block defines the TIME OF DAY and ATMOSPHERE):
${projectContext}

TASK: Execute your primary function (as defined in System Instructions) using solely the provided INPUT_IMAGE as the geometry source and the FORENSIC_CATALOG as the material source. CRITICAL: the PROJECT CONTEXT above defines the TIME OF DAY and LIGHTING MOOD that the final render must reflect — even if the FORENSIC_CATALOG describes a scene captured in different lighting, you MUST adapt the final render to the time of day specified in the PROJECT CONTEXT. The viewport shows the SketchUp 3D model with default neutral lighting; the final render must reinterpret that geometry under the specified mood (e.g., if mood is 'noite', the final render is a nighttime scene with dark exterior, even if the viewport shows daytime; if mood is 'golden hour', warm low sun, etc).`;
}

// Seção 6.3 — devolve "" se o usuário não escreveu direção nenhuma.
export function buildUserCustomization(prompt: string): string {
  const valor = prompt.trim();
  if (!valor) return "";

  return `

# USER CUSTOMIZATION (SPECIFIC MODIFICATIONS)
The FORENSIC CATALOG provided above is the ABSOLUTE SOURCE OF TRUTH for all objects and materials in this scene.
However, the user has requested the following specific change:
"${valor}"

This request is AUTHORIZED and MUST be applied — including adding a new object if that is what was requested (e.g. a vehicle, a plant, a decorative item). The general rule against adding/removing objects applies ONLY to elements NOT mentioned in this request. For all other elements not covered by this request, strictly maintain the descriptions, materials, and properties as defined in the FORENSIC CATALOG. Do not deviate from the catalog for any element not explicitly mentioned in the user modification above.`;
}
