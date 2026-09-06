import type { GrupoPills } from "../tipos";

// Frases em inglês testadas e curadas — vão direto pra Runway sem tradução.
// Só o rótulo (chave i18n) é exibido pro usuário.
export const catalogoPillsMovimento: GrupoPills[] = [
  {
    chaveRotulo: "conta.videos.pills.grupoCamera",
    pills: [
      {
        id: "zoom-in",
        chaveRotulo: "conta.videos.pills.itens.zoomIn",
        frase:
          "The camera slowly moves forward, gradually approaching the scene with a smooth cinematic push-in.",
      },
      {
        id: "zoom-out",
        chaveRotulo: "conta.videos.pills.itens.zoomOut",
        frase:
          "The camera slowly pulls back, gradually moving away from the scene with a smooth cinematic dolly-out.",
      },
      {
        id: "deslizamento-horizontal",
        chaveRotulo: "conta.videos.pills.itens.deslizamentoHorizontal",
        frase:
          "The camera glides smoothly to the side, performing a slow lateral tracking shot across the scene.",
      },
      {
        id: "rotacionar",
        chaveRotulo: "conta.videos.pills.itens.rotacionar",
        frase: "The camera performs a gentle, slow rotation, with a subtle cinematic turn.",
      },
      {
        id: "movimento-orbital",
        chaveRotulo: "conta.videos.pills.itens.movimentoOrbital",
        frase:
          "The camera slowly orbits around the main subject, smoothly circling it from one side to the other.",
      },
    ],
  },
  {
    chaveRotulo: "conta.videos.pills.grupoInterno",
    pills: [
      {
        id: "cortina-vento",
        chaveRotulo: "conta.videos.pills.itens.cortinaVento",
        frase: "Curtains and fabrics gently sway as if moved by a soft breeze.",
      },
      {
        id: "torneira-aberta",
        chaveRotulo: "conta.videos.pills.itens.torneiraAberta",
        frase:
          "Running water flows continuously from the faucet or shower with realistic motion and slight splashes.",
      },
      {
        id: "persiana-movimento",
        chaveRotulo: "conta.videos.pills.itens.persianaMovimento",
        frase: "Curtains or blinds slowly open or close with a smooth, natural motion.",
      },
    ],
  },
  {
    chaveRotulo: "conta.videos.pills.grupoExterno",
    pills: [
      {
        id: "arvores-movimento",
        chaveRotulo: "conta.videos.pills.itens.arvoresMovimento",
        frase: "Trees, leaves and outdoor vegetation sway gently in the breeze.",
      },
      {
        id: "agua-movimento",
        chaveRotulo: "conta.videos.pills.itens.aguaMovimento",
        frase: "The pool surface has subtle, realistic ripples and gentle wave motion.",
      },
      {
        id: "cascata-fluindo",
        chaveRotulo: "conta.videos.pills.itens.cascataFluindo",
        frase: "A waterfall or cascade flows continuously with realistic falling water motion.",
      },
    ],
  },
  {
    chaveRotulo: "conta.videos.pills.grupoIluminacao",
    pills: [
      {
        id: "timelapse",
        chaveRotulo: "conta.videos.pills.itens.timelapse",
        frase:
          "A smooth time-lapse transition of natural light from sunrise through daytime to sunset and night, with the sky and shadows gradually shifting.",
      },
      {
        id: "nuvens-passando",
        chaveRotulo: "conta.videos.pills.itens.nuvensPassando",
        frase: "Clouds slowly drift across the sky, casting soft moving shadows.",
      },
      {
        id: "sombras-deslocando",
        chaveRotulo: "conta.videos.pills.itens.sombrasDeslocando",
        frase: "Sunlight shadows gradually shift and move across surfaces, suggesting the passage of time.",
      },
      {
        id: "acender-luzes",
        chaveRotulo: "conta.videos.pills.itens.acenderLuzes",
        frase:
          "Interior artificial lights gradually turn ON, transitioning from off to on with a smooth fade-in.",
      },
    ],
  },
];

export const PROMPT_PADRAO_VIDEO =
  "Slow cinematic camera push-in through the architectural space. Subtle ambient atmosphere, gentle natural light variation.";
