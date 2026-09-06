// Estimativa de profundidade 100% local (sem servidor, sem custo) — usada
// pra dar movimento de câmera realista (parallax 2.5D) numa imagem só.
// Carregada sob demanda: só quando o usuário escolhe o modo "Câmera" e clica
// em gerar, pra não pesar o bundle de quem nunca usa essa opção.
let estimadorCache: unknown = null;

export async function estimarMapaProfundidade(imagemFonte: HTMLImageElement): Promise<HTMLCanvasElement> {
  const { pipeline, RawImage } = await import("@huggingface/transformers");

  if (!estimadorCache) {
    estimadorCache = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", {
      device: "wasm",
    });
  }
  const estimador = estimadorCache as (
    entrada: unknown
  ) => Promise<{ depth: { toCanvas: () => HTMLCanvasElement } }>;

  const canvasEntrada = document.createElement("canvas");
  canvasEntrada.width = imagemFonte.naturalWidth;
  canvasEntrada.height = imagemFonte.naturalHeight;
  const contexto = canvasEntrada.getContext("2d");
  if (!contexto) throw new Error("Não foi possível processar esta imagem.");
  contexto.drawImage(imagemFonte, 0, 0);

  const imagemBruta = RawImage.fromCanvas(canvasEntrada);
  const { depth } = await estimador(imagemBruta);
  return depth.toCanvas();
}
