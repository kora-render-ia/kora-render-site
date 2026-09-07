import type { Vista } from "../tipos";

interface DefinicaoVista {
  label: string;
  paisagem: string;
}

const VISTAS: Record<Exclude<Vista, "nenhum">, DefinicaoVista> = {
  cidade: {
    label: "cidade",
    paisagem:
      "A real Brazilian URBAN view: mid-to-high-rise residential buildings and apartment towers (balconies, glass and concrete), receding toward the horizon into soft atmospheric haze. Street life far below where it fits. The city sits BEYOND the glass, at a believable distance and grounded on its own horizon line — never floating, never pasted flat against the window.",
  },
  mar: {
    label: "mar",
    paisagem:
      "A real OCEAN / sea view: open water meeting the sky at a clean horizon line, gentle waves and light glints on the surface, a soft coastal atmosphere. Optionally a thin strip of beach or coastline in the distance. The sea sits BEYOND the glass at a natural distance, its horizon level and consistent across all windows.",
  },
  montanhas: {
    label: "montanhas",
    paisagem:
      "A real MOUNTAIN / serra view: forested hills or a mountain range along the horizon, receding into atmospheric haze, with cooler high-altitude light. The mountains sit grounded on the horizon line BEYOND the glass — never as a wall hovering right against the window.",
  },
  mata: {
    label: "mata (pouco densa)",
    paisagem:
      "A LIGHTLY WOODED green view: real, clearly VISIBLE native Brazilian trees beyond the glass — sparse rather than a closed jungle, with open gaps of sky and sunlight between individual trees, plus low shrubs and grasses. Sparse means SPACED-OUT trees, NOT an empty or barely-green view: there must be several distinct, recognizable trees with trunks and foliage clearly present in the view, at a natural depth (not pressed flat against the window). Open, airy, sunlit woodland — you can plainly see it is a wooded setting. NOT a dense jungle, but definitely a green wooded view, never an empty or near-bare background.",
  },
  mata_densa: {
    label: "mata densa",
    paisagem:
      "A LUSH, DENSE Brazilian native forest view (Mata Atlântica): a rich, layered backdrop of tall trees with a full leafy canopy, dense foliage, ferns, palms and tropical undergrowth, deep greens with real depth between the layers. Clearly a dense, abundant forest — visibly fuller and greener than a sparse wood — but still natural and breathable, set a little BEYOND the glass with depth, soft daylight filtering through the leaves, and some sky and light still reading between the upper branches. NOT a flat green wallpaper pasted on the window, and NOT an oppressive wall of jungle pressed against the pane — a believable dense forest seen through the window.",
  },
  jardim: {
    label: "jardim tropical",
    paisagem:
      "A LUSH, clearly VISIBLE TROPICAL GARDEN packed right outside the glass: abundant layered ornamental planting filling the view — tall palms, big broad glossy tropical leaves (monstera, banana, heliconia, elephant ear), ferns, flowering shrubs (hibiscus, ginger) and dense ground cover, in rich varied greens with real depth. A full, well-kept, densely planted garden plainly seen through the window, with warm natural daylight filtering through the leaves and soft shadows. The garden must be obviously present and green-filled — NOT an empty, plain, grey or near-bare background. Closer and more intimate than a forest (a designed, cultivated garden, not wild bush), but unmistakably a lush tropical garden right there beyond the glass.",
  },
  jardim_residencial: {
    label: "jardim residencial",
    paisagem:
      "A real, well-designed RESIDENTIAL TROPICAL GARDEN seen through the glass — Brazilian high-end home landscaping (Burle Marx feel): LUSH but ORGANIZED and clean, not wild jungle. Layered ornamental planting beds, FULL and green, arranged in a deliberate, cultivated way: big bold tropical foliage (monstera/costela-de-adão, banana and bird-of-paradise/estrelítzia leaves, elephant-ear/alocasia, philodendron), fan and feather palms, ferns and clipped shrubs, in rich varied greens with real depth and good plant spacing — abundant yet tidy and intentional. Combine the dense planting with clean residential elements: a neatly MOWED LAWN edge and/or a stone/porcelain paved area or path in the foreground, crisp bed borders, a calm contemporary home-garden feel. Optionally a low garden wall or fence behind the planting where it fits, but the FOLIAGE is the point, not the wall. Natural daylight, soft shadows. It must read clearly as a designed, well-kept tropical garden of an upscale home — green, full and beautiful but ORGANIZED and clean — NOT an overgrown wild jungle, NOT a sparse or empty grey background.",
  },
};

// Seção 6.6 — só se aplica a interior; retorna "" se vista == "nenhum".
export function buildDefinicaoVista(vista: Vista): string {
  if (vista === "nenhum") return "";

  const { label, paisagem } = VISTAS[vista];

  return `

━━━ WINDOW VIEW (what is seen THROUGH the glass — the user explicitly chose: "${label}") ━━━
⚠️ READ FIRST: this controls ONLY the landscape visible BEYOND the windows/glass of this interior. It does NOT touch the room. Keep the EXACT same camera, framing and zoom as the viewport, and never alter the interior (geometry, furniture, materials, colors, finishes, ceiling, floor, walls all stay 100% locked). You are only painting the outdoor scene seen through the existing window openings — nothing else.
WHAT TO PUT BEYOND THE GLASS:
${paisagem}
HOW TO APPLY IT (in order):
• ONLY THROUGH EXISTING OPENINGS: the view appears ONLY where the model already has a window, glass door, or opening. Do NOT add new windows, do NOT enlarge openings, do NOT turn a solid wall into glass. The frames, mullions, sills and glass thickness stay exactly as modeled.
• SIT IT BEYOND THE GLASS WITH DEPTH: the landscape lives OUTSIDE, at a believable distance, with real atmospheric depth and perspective consistent with the camera — never a flat picture pasted on the window pane. A subtle, realistic glass reflection of the interior is welcome where the angle allows.
• CONSISTENT ACROSS WINDOWS: if several windows are visible, they all look onto the SAME coherent outdoor scene from their respective angles (same horizon level, same time of day, same weather) — not a different world in each window.
• MATCH THE LIGHT: the view is photographed in the SAME time of day, weather and color grading as the interior mood. Daylight outside means daylight pouring in; an evening mood means a dusk/night view with appropriate sky and distant lights. The light coming through the glass should be consistent with the scene outside.
• THE ROOM STAYS UNTOUCHED: adding the view must NEVER recolor, relight beyond the natural window light, restyle, move or alter any interior surface or object. But the room being locked is NOT a reason to skip the view — the view lives entirely outside the glass and never competes with the room.
🟢 MANDATORY: the chosen view ("${label}") MUST be clearly VISIBLE through the glass. An output where the windows show an empty, plain, grey or near-bare background instead of the chosen scene is a FAILURE. Render the view so anyone looking at the photo immediately recognizes "${label}" outside. This requirement is REQUIRED, not optional — only the room interior stays untouched; the glass MUST show the scene.
━━━ END WINDOW VIEW ━━━
`;
}
