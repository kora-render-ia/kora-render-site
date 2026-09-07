interface ParteConteudo {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

const BLOCO_LUZES_FLASH = (temperatura: string) => `MANDATORY LIGHTS ON AT ${temperatura}:
Look at the input image. Find every object with the SHAPE of a lamp shade — conical, dome, bowl or drum hanging from ceiling by wire/rod (pendant), or shade on a base on furniture (abajur). MAKE THEM GLOW:
- Pendant: shade lit from within, warm amber glow through material, bright center, cone of light downward onto table/surface below.
- Abajur/table lamp: shade glows from within, warm translucent fabric, bright bulb core visible, warm halo on nearby wall.
DO NOT add sancas, LED strips or any fixture not in the input. DO NOT add ceiling spots not in the input.`;

const BLOCO_PRESERVACAO_FLASH = `PRESERVATION RULES — DO NOT VIOLATE:
1. White/light walls are WALLS — never render as windows.
2. Glass = clear neutral, never green.
3. Curtains stay in same position as input.
4. Plain white ceiling is CORRECT — do NOT add sancas or LED strips.
5. Do NOT add, remove or move any object.
6. Exterior areas: render ONLY what is visible — no sky, clouds or cityscape not in the input.`;

const BLOCO_FOTOGRAFIA_FLASH = `MAKE IT A REAL PHOTOGRAPH, NOT A 3D RENDER (apply in every mood):
- Treat the output as a frame shot on a full-frame DSLR with a 24mm tilt-shift architectural lens at f/8.
- Natural dynamic range: soft highlight roll-off (no blown whites), shadows keep gentle detail (no crushed black, no flat HDR), realistic global illumination and soft contact shadows.
- Real-lens imperfection sells the photo: ultra-fine natural film grain over the WHOLE image, micro tonal variation on every surface, faint dust and subtle smudges on glass/metal, slightly uneven reflections.
- Natural photographic color and contrast — NOT punchy, NOT over-saturated, NOT over-clean, NOT over-sharpened. No HDR halos, no fake bloom/glow, no artificial perfection.
- Materials read as physical, never plastic/waxy.
- If it looks like Lumion / Enscape / V-Ray / a videogame, it FAILED. It must look photographed.`;

// Seção 7.1 — ordem exata das partes do contents. Se o modelo for o flash,
// insere partes de texto extras ANTES da user_customization (empiricamente
// o flash presta mais atenção ao que vem nas parts do que ao
// systemInstruction).
export function montarPartesRender(
  taskText: string,
  base64Png: string,
  userCustomization: string,
  ehFlash: boolean,
  temperatura: string
): ParteConteudo[] {
  const partes: ParteConteudo[] = [
    { text: taskText },
    { inlineData: { mimeType: "image/png", data: base64Png } },
  ];

  if (ehFlash) {
    if (temperatura && temperatura !== "desligado") {
      partes.push({ text: BLOCO_LUZES_FLASH(temperatura) });
    }
    partes.push({ text: BLOCO_PRESERVACAO_FLASH });
    partes.push({ text: BLOCO_FOTOGRAFIA_FLASH });
  }

  if (userCustomization) {
    partes.push({ text: userCustomization });
  }

  return partes;
}
