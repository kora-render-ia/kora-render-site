import type { Mood } from "../tipos";

// Seção 5.2 — texto literal por mood, usado tanto no catálogo interior
// quanto no exterior (a spec reaproveita a mesma tabela nos dois).
export function textoHora(hora: Mood | ""): string {
  switch (hora) {
    case "noite":
      return "Time of day: NIGHT — exterior is dark (night sky, possibly distant city lights), interior is illuminated only by artificial fixtures. The viewport may show daytime, but the user explicitly chose NIGHT; the final render MUST be a nighttime scene.";
    case "blue hour":
      return "Time of day: BLUE HOUR (twilight just after sunset) — exterior shows deep blue gradient sky, transition between day and night. The viewport may show daytime, but the user chose BLUE HOUR.";
    case "sem luz natural":
      return "Time of day: NO NATURAL LIGHT — windows show dark exterior; all illumination comes from interior fixtures.";
    case "golden hour":
      return "Time of day: GOLDEN HOUR — warm orange-amber sunlight at low angle, long soft shadows. The viewport may show neutral midday lighting, but the user chose GOLDEN HOUR.";
    case "fim do dia":
      return "Time of day: LATE AFTERNOON — soft warm light, pink/peach sky near horizon, low sun.";
    case "overcast":
      return "Time of day: OVERCAST — flat grey uniform sky, no direct sunlight, soft diffused light.";
    case "meio-dia":
    case "ceu brasileiro":
      return "Time of day: BRIGHT MIDDAY — strong direct sunlight, vivid blue sky, sharp shadows.";
    case "":
      return "Time of day: report whatever natural lighting is visible in the viewport.";
    default:
      return `Time of day: ${hora.toUpperCase()} — adapt the natural lighting to match this mood, not the viewport's default lighting.`;
  }
}
