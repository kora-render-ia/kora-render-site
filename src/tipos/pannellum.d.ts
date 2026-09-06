// Pannellum não publica tipos próprios; declaramos aqui apenas a fatia da API
// que o VisualizadorPanorama consome. Ver node_modules/pannellum/src/js/pannellum.js.
declare module "pannellum/build/pannellum.js";

interface VisualizadorPannellumStrings {
  loadButtonLabel?: string;
  loadingLabel?: string;
  bylineLabel?: string;
  noPanoramaError?: string;
  fileAccessError?: string;
  malformedURLError?: string;
  iOS8WebGLError?: string;
  genericWebGLError?: string;
  textureSizeError?: string;
  unknownError?: string;
}

interface ConfiguracaoVisualizadorPannellum {
  type: "equirectangular";
  panorama: string;
  autoLoad?: boolean;
  showControls?: boolean;
  showZoomCtrl?: boolean;
  showFullscreenCtrl?: boolean;
  compass?: boolean;
  draggable?: boolean;
  mouseZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboardZoom?: boolean;
  friction?: number;
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
  pitch?: number;
  yaw?: number;
  backgroundColor?: [number, number, number];
  crossOrigin?: string;
  strings?: VisualizadorPannellumStrings;
}

interface VisualizadorPannellum {
  getPitch(): number;
  getYaw(): number;
  getHfov(): number;
  setHfov(hfov: number, animated?: number | boolean): VisualizadorPannellum;
  lookAt(
    pitch?: number,
    yaw?: number,
    hfov?: number,
    animated?: number | boolean
  ): VisualizadorPannellum;
  startAutoRotate(speed?: number): VisualizadorPannellum;
  stopAutoRotate(): VisualizadorPannellum;
  isLoaded(): boolean;
  resize(): void;
  destroy(): void;
  on(evento: string, callback: (...args: never[]) => void): VisualizadorPannellum;
  off(evento: string, callback?: (...args: never[]) => void): VisualizadorPannellum;
}

interface Window {
  pannellum: {
    viewer(
      elemento: HTMLElement | string,
      config: ConfiguracaoVisualizadorPannellum
    ): VisualizadorPannellum;
  };
}
