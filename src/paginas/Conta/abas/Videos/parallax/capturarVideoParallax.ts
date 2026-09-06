const TIPOS_MIME_CANDIDATOS = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
const QUADROS_POR_SEGUNDO = 30;

function tipoMimeSuportado(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  return TIPOS_MIME_CANDIDATOS.find((tipo) => MediaRecorder.isTypeSupported(tipo)) ?? null;
}

export function gravacaoDeVideoSuportada(): boolean {
  return tipoMimeSuportado() !== null && typeof HTMLCanvasElement.prototype.captureStream === "function";
}

// Toca a animação do parallax por `duracaoSegundos`, chamando `avancar(t)` a
// cada quadro (t de 0 a 1) e gravando o canvas nesse intervalo — tudo local,
// sem upload nenhum. Devolve o Blob do vídeo gerado.
export function capturarVideoParallax(
  canvas: HTMLCanvasElement,
  avancar: (progresso: number) => void,
  duracaoSegundos: number
): Promise<Blob> {
  const tipoMime = tipoMimeSuportado();
  if (!tipoMime) return Promise.reject(new Error("gravacao_nao_suportada"));

  const stream = canvas.captureStream(QUADROS_POR_SEGUNDO);
  const gravador = new MediaRecorder(stream, { mimeType: tipoMime });
  const pedacos: Blob[] = [];

  gravador.ondataavailable = (evento) => {
    if (evento.data.size > 0) pedacos.push(evento.data);
  };

  return new Promise((resolve, reject) => {
    gravador.onerror = () => reject(new Error("gravacao_falhou"));
    gravador.onstop = () => resolve(new Blob(pedacos, { type: tipoMime }));

    gravador.start();
    const inicio = performance.now();

    function quadro(agora: number) {
      const progresso = Math.min(1, (agora - inicio) / (duracaoSegundos * 1000));
      avancar(progresso);
      if (progresso < 1) {
        requestAnimationFrame(quadro);
      } else {
        gravador.stop();
      }
    }

    requestAnimationFrame(quadro);
  });
}
