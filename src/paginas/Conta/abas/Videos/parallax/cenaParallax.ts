import * as THREE from "three";
import type { IdMovimentoCamera } from "../tipos";

const SEGMENTOS_MALHA = 180;
const ESCALA_DESLOCAMENTO = 0.22;

// Amplitudes maiores que a v1 — a malha agora tem uma margem extra (ver
// planoLargura/planoAltura) especificamente pra suportar esse movimento sem
// expor fundo preto nas bordas. Ainda não é uma órbita completa: isso é uma
// única imagem com profundidade estimada, não uma cena 3D real, então tem um
// teto antes de começar a esticar/rasgar a malha visivelmente.
function calcularPose(id: IdMovimentoCamera, progresso: number): { posicao: THREE.Vector3; alvo: THREE.Vector3 } {
  const suavizado = 0.5 - 0.5 * Math.cos(Math.PI * progresso);
  const alvo = new THREE.Vector3(0, 0, 0);

  switch (id) {
    case "zoom-in":
      return { posicao: new THREE.Vector3(0, 0, 1.55 - suavizado * 0.6), alvo };
    case "zoom-out":
      return { posicao: new THREE.Vector3(0, 0, 0.95 + suavizado * 0.6), alvo };
    case "deslizamento-horizontal":
      return { posicao: new THREE.Vector3(-0.25 + suavizado * 0.5, 0, 1.3), alvo };
    case "rotacionar": {
      const angulo = (-0.06 + suavizado * 0.12) * Math.PI;
      return {
        posicao: new THREE.Vector3(Math.sin(angulo) * 1.3, 0, Math.cos(angulo) * 1.3),
        alvo,
      };
    }
    case "movimento-orbital": {
      // Girar em arco (não translação reta) é o que mais expõe a borda do
      // plano — é só uma imagem plana com profundidade estimada, sem
      // conteúdo real atrás. Amplitude deliberadamente menor que os outros
      // movimentos por causa disso.
      const angulo = (-0.11 + suavizado * 0.22) * Math.PI;
      return {
        posicao: new THREE.Vector3(Math.sin(angulo) * 1.35, 0.05, Math.cos(angulo) * 1.35),
        alvo,
      };
    }
  }
}

export interface CenaParallax {
  avancar: (progresso: number) => void;
  destruir: () => void;
}

export function criarCenaParallax(
  canvas: HTMLCanvasElement,
  imagemCor: HTMLCanvasElement | HTMLImageElement,
  imagemProfundidade: HTMLCanvasElement,
  movimento: IdMovimentoCamera,
  largura: number,
  altura: number
): CenaParallax {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(largura, altura, false);
  renderer.setPixelRatio(1);

  const cena = new THREE.Scene();
  const proporcao = largura / altura;
  const camera = new THREE.PerspectiveCamera(50, proporcao, 0.1, 10);

  // Maior que o enquadramento da câmera de propósito: dá margem pro
  // movimento aumentado acima sem revelar fundo preto nas bordas.
  const planoLargura = proporcao >= 1 ? 2.1 : 2.1 * proporcao;
  const planoAltura = proporcao >= 1 ? 2.1 / proporcao : 2.1;

  const geometria = new THREE.PlaneGeometry(planoLargura, planoAltura, SEGMENTOS_MALHA, SEGMENTOS_MALHA);
  const texturaCor = new THREE.CanvasTexture(imagemCor);
  texturaCor.colorSpace = THREE.SRGBColorSpace;
  const texturaProfundidade = new THREE.CanvasTexture(imagemProfundidade);

  const material = new THREE.MeshStandardMaterial({
    map: texturaCor,
    displacementMap: texturaProfundidade,
    displacementScale: ESCALA_DESLOCAMENTO,
    displacementBias: -ESCALA_DESLOCAMENTO / 2,
    roughness: 1,
    metalness: 0,
  });

  const malha = new THREE.Mesh(geometria, material);
  cena.add(malha);
  cena.add(new THREE.AmbientLight(0xffffff, 3.2));

  function avancar(progresso: number) {
    const { posicao, alvo } = calcularPose(movimento, Math.min(1, Math.max(0, progresso)));
    camera.position.copy(posicao);
    camera.lookAt(alvo);
    renderer.render(cena, camera);
  }

  avancar(0);

  function destruir() {
    geometria.dispose();
    material.dispose();
    texturaCor.dispose();
    texturaProfundidade.dispose();
    renderer.dispose();
  }

  return { avancar, destruir };
}
