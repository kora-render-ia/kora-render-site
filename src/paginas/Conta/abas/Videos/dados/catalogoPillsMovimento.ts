import type { GrupoPills, MovimentoCamera } from "../tipos";

// Movimentos de câmera puros — renderizados localmente via parallax (sem IA,
// sem custo, ver src/paginas/Conta/abas/Videos/parallax). Não precisam de
// frase em inglês porque não passam por nenhum modelo de geração.
export const catalogoMovimentosCamera: MovimentoCamera[] = [
  { id: "zoom-in", chaveRotulo: "conta.videos.camera.itens.zoomIn" },
  { id: "zoom-out", chaveRotulo: "conta.videos.camera.itens.zoomOut" },
  { id: "deslizamento-horizontal", chaveRotulo: "conta.videos.camera.itens.deslizamentoHorizontal" },
  { id: "rotacionar", chaveRotulo: "conta.videos.camera.itens.rotacionar" },
  { id: "movimento-orbital", chaveRotulo: "conta.videos.camera.itens.movimentoOrbital" },
];

// Pills de efeito ambiental — só essas passam pela IA (fal.ai/LTX), porque
// sintetizam movimento que não existe na imagem original. Frases em inglês
// testadas e curadas, enviadas direto no prompt.
export const catalogoPillsAmbiente: GrupoPills[] = [
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
