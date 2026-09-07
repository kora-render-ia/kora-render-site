import { detectarPedidoPessoa } from "../utilitarios/detectarPedidoPessoa";
import type { ParteConteudo } from "../../../../../servicos/servicoGoogleIA";

const SYSTEM_REFINAMENTO_NORMAL = `You are converting a SketchUp 3D model viewport into a photorealistic architectural photograph.

This is an IMAGE-TO-IMAGE EDIT. Apply ONLY photorealistic textures, lighting, and atmosphere. Keep everything else in the image exactly the same.

FIDELITY CONSTRAINTS (strictly enforce):
— preserve exact spatial layout, furniture placement, and composition
— keep original materials, finishes, textures and color palette unchanged
— same architecture, same geometry, no redesign, no structural changes
— preserve every visible decorative object exactly as shown

Only transformation allowed: render appearance → real photograph appearance.

Negative: no distortion, no redesign, no added furniture, no removed objects, no style change.

Consistency: follow these rules exactly and deterministically — do not introduce creative variation beyond what is explicitly instructed above.`;

const SYSTEM_REFINAMENTO_PESSOA = `You are editing an architectural photograph to add a photorealistic human figure.

This is an IMAGE-TO-IMAGE EDIT that ADDS one element (a person) while preserving everything else.

FIDELITY CONSTRAINTS FOR THE ENVIRONMENT (strictly enforce):
— preserve exact spatial layout, furniture placement, and composition
— keep original materials, finishes, textures and color palette unchanged
— same architecture, same geometry, no redesign, no structural changes
— preserve every visible decorative object exactly as shown

EXCEPTION: the person requested by the user is AUTHORIZED and MUST be added — the rules above apply ONLY to the existing environment, never to the new person being created.

Negative (applies to the ENVIRONMENT only, never to the requested person): no distortion, no redesign, no added furniture besides the requested person, no removed objects, no style change.

Consistency: follow these rules exactly and deterministically — do not introduce creative variation beyond what is explicitly requested.`;

const HUMAN_FIGURE_REALISM = `*** HUMAN FIGURE REALISM — CRITICAL ***
The user is asking to add a human figure to the scene. The figure will be created from scratch (there is NO person geometry in the source image to preserve, so you have complete freedom for the human body itself). Generate a PHOTOGRAPHIC HUMAN, not a CGI character.

MANDATORY HUMAN REALISM SPECIFICATIONS (include all of these in your final prompt):
- Photographic style: editorial fashion photography, shot on Hasselblad H6D-100C or Leica SL2, 50mm or 85mm prime lens, f/2.0–f/2.8 aperture, natural window light.
- Skin: visible pores, subtle skin texture variation, natural micro-shadows under chin and around eyes, faint freckles or skin imperfections, NO airbrushed plastic skin.
- Hair: individual hair strands visible at edges, natural messiness, soft shadow against scalp, NO helmet hair, NO solid sculpted blob.
- Fabric: real cloth physics — wrinkles that respond to the body's pose, soft folds where fabric bunches, natural drape with gravity, visible weave texture (linen grain, cotton weft, boucle loops), NO flat or stiff surface.
- Hands and fingers: anatomically correct proportions, natural relaxed posture (not stiff), correct number of fingers, soft tendon shadows, subtle nail variation.
- Body proportions: realistic adult proportions matching real photography, NOT idealized fashion-illustration body, NOT exaggerated.
- Pose: natural, candid, with realistic weight distribution; subject should look caught in a natural moment, not posed stiffly.
- Eyes (if visible): catchlight from the natural window light source, soft eyelash detail, realistic iris pattern.
- Contact shadows: where the body touches furniture (back against chair, hand on armrest, feet on floor), there must be soft realistic contact shadows.

EXPLICIT ANTI-PATTERNS to forbid in your final prompt (use phrases like "NO ___"):
- NO plastic doll skin, NO mannequin face, NO uncanny valley, NO 3D-rendered character, NO CGI human, NO video-game character, NO Pixar-style figure, NO airbrushed perfection, NO stiff doll pose, NO symmetrical idealization, NO helmet hair, NO sculpted clothing without folds.

OUTPUT REQUIREMENT: When writing the final image, dedicate significant attention to the human figure with the specifications above — the human realism is the most important part of this image.
*** END HUMAN FIGURE REALISM ***`;

export interface PromptRefinamento {
  system: string;
  textoFinal: string;
  pedePessoa: boolean;
}

// Seção 9 — pula o catálogo (etapa 1), vai direto pra geração usando a
// imagem já renderizada como base.
export function montarPromptRefinamento(prompt: string): PromptRefinamento {
  const pedePessoa = detectarPedidoPessoa(prompt);

  if (pedePessoa) {
    const textoFinal = `You are editing an architectural photograph to ADD a person. The interior/exterior stays the same; the PERSON is created fresh.

REQUESTED CHANGE: ${prompt}

RULES:
- ADD the person described above. There is NO person in the source to preserve, so you have COMPLETE freedom to render a fully photographic human (see HUMAN FIGURE REALISM below).
- Preserve the rest of the scene: keep materials, colors, furniture, architecture, camera angle and framing identical.
- Integrate the person naturally: correct scale and perspective for where they stand, lighting and shadows matching the room, soft contact shadow on the floor.
- Result: a real photograph, no watermark, no text overlay.

${HUMAN_FIGURE_REALISM}`;

    return { system: SYSTEM_REFINAMENTO_PESSOA, textoFinal, pedePessoa };
  }

  const textoFinal = `You are editing an existing architectural photograph. This is NOT a new generation.

SINGLE CHANGE REQUESTED: ${prompt}

ABSOLUTE RULES — ZERO EXCEPTIONS:
1. Apply ONLY the single change described above. Nothing else changes.
2. Every material, color, texture, furniture piece, object, and surface NOT mentioned in the change request must remain 100% identical to the input image.
3. Camera angle, focal length, perspective, framing, and composition must be 100% identical.
4. Lighting direction, intensity, and mood must remain identical unless explicitly requested to change.
5. Do NOT add, remove, or relocate any furniture, object, or architectural element unless explicitly requested.
6. Do NOT change wall colors, floor materials, ceiling, windows, doors, or structural elements.
7. The output must look like the exact same photograph with only the requested change applied.
8. Result: professional architectural photograph, no watermark, no text overlay, zero CGI artifacts.`;

  return { system: SYSTEM_REFINAMENTO_NORMAL, textoFinal, pedePessoa };
}

// Seção 9.1 — ordem exata das parts. Com imagem de referência (edição
// guiada por um render anterior do mesmo projeto), usa as 3 partes 1a/1b/1c
// antes da imagem atual; sem referência, usa só a SOURCE IMAGE.
export function montarPartesRefinamento(
  imagemAtualBase64: string,
  textoFinal: string,
  referenciaBase64?: string
): ParteConteudo[] {
  if (referenciaBase64) {
    return [
      {
        text: "REFERENCE IMAGE 1 — Previously rendered scene of the SAME project. Match its color palette, material finishes, lighting style, and atmosphere exactly. [See attached IMAGE 1]",
      },
      { inlineData: { mimeType: "image/png", data: referenciaBase64 } },
      {
        text: "REFERENCE IMAGE 2 — Current SketchUp viewport to render. Preserve every element exactly as shown, but apply the SAME visual style as reference image 1. [See attached IMAGE 2]",
      },
      { inlineData: { mimeType: "image/png", data: imagemAtualBase64 } },
      { text: textoFinal },
    ];
  }

  return [
    { text: "SOURCE IMAGE — The SketchUp viewport / architectural photograph to edit. [See attached IMAGE 1]" },
    { inlineData: { mimeType: "image/png", data: imagemAtualBase64 } },
    { text: textoFinal },
  ];
}
