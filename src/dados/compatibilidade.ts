export const itensCompatibilidade = [
  { id: "su-2023", suportado: true, icone: "check" as const },
  { id: "su-2024", suportado: true, icone: "check" as const },
  { id: "su-2025", suportado: true, icone: "check" as const },
  { id: "su-2026", suportado: true, icone: "check" as const },
  { id: "windows", suportado: true, icone: "windows" as const },
  { id: "macos", suportado: false, icone: "mac" as const },
];

export const rotulosCompatibilidade: Record<string, string> = {
  "su-2023": "SketchUp 2023",
  "su-2024": "SketchUp 2024",
  "su-2025": "SketchUp 2025",
  "su-2026": "SketchUp 2026",
  windows: "Windows",
  macos: "macOS",
};
