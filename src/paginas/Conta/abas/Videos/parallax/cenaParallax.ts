import * as THREE from "three";
import type { IdMovimentoCamera } from "../tipos";

const SEGMENTOS_MALHA = 180;
const ESCALA_DESLOCAMENTO = 0.14;

// Amplitudes deliberadamente pequenas — isso não é uma cena 3D real, é uma
// única imagem com profundidade estimada, então movimentos exagerados
// esticam/rasgam a malha nas bordas. O objetivo é o "efeito paralaxe" sutil
// de câmeras de vídeo profissionais, não uma órbita completa.
function calcularPose(id: IdMovimentoCamera, progresso: number): { posicao: THREE.Vector3; alvo: THREE.Vector3 } {
  const suavizado = 0.5 - 0.5 * Math.cos(Math.PI * progresso);
  const alvo = new THREE.Vector3(0, 0, 0);

  switch (id) {
    case "zoom-in":
      return { posicao: new THREE.Vector3(0, 0, 1.55 - suavizado * 0.35), alvo };
    case "zoom-out":
      return { posicao: new THREE.Vector3(0, 0, 1.2 + suavizado * 0.35), alvo };
    case "deslizamento-horizontal":
      return { posicao: new THREE.Vector3(-0.12 + suavizado * 0.24, 0, 1.3), alvo };
    case "rotacionar": {
      const angulo = (-0.035 + suavizado * 0.07) * Math.PI;
      return {
        posicao: new THREE.Vector3(Math.sin(angulo) * 1.3, 0, Math.cos(angulo) * 1.3),
        alvo,
      };
    }
    case "movimento-orbital": {
      const angulo = (-0.09 + suavizado * 0.18) * Math.PI;
      return {
        posicao: new THREE.Vector3(Math.sin(angulo) * 1.35, 0.03, Math.cos(angulo) * 1.35),
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
  const camera = new THREE.PerspectiveCamera(45, proporcao, 0.1, 10);

  const planoLargura = proporcao >= 1 ? 1.6 : 1.6 * proporcao;
  const planoAltura = proporcao >= 1 ? 1.6 / proporcao : 1.6;

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
