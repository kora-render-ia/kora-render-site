import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ControlesPanorama from "../ControlesPanorama";
import "pannellum/build/pannellum.css";
import "pannellum/build/pannellum.js";
import "./pannellumOverrides.css";

// "Zoom mínimo" aqui é o hfov mais alto (ângulo mais aberto): menos ampliação
// da textura equiretangular, então a imagem chega mais nítida. O visualizador
// abre travado nesse valor — sem botões de zoom e sem interações de zoom
// (roda do mouse, duplo clique, teclado, pinça) — fixando min/maxHfov no
// mesmo número, que é o jeito do Pannellum de travar completamente o hfov.
const HFOV_FIXO = 118;
const VELOCIDADE_AUTOROTATE = -2;

interface PropriedadesVisualizadorPanorama {
  url: string;
  aoFalhar: (mensagem: string) => void;
}

export default function VisualizadorPanorama({ url, aoFalhar }: PropriedadesVisualizadorPanorama) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const envolucroRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<VisualizadorPannellum | null>(null);

  const [carregandoImagem, setCarregandoImagem] = useState(true);
  const [autoRotateAtivo, setAutoRotateAtivo] = useState(false);
  const [emTelaCheia, setEmTelaCheia] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelado = false;
    setCarregandoImagem(true);
    setAutoRotateAtivo(false);

    const viewer = window.pannellum.viewer(containerRef.current, {
      type: "equirectangular",
      panorama: url,
      autoLoad: true,
      showControls: false,
      compass: false,
      draggable: true,
      mouseZoom: false,
      doubleClickZoom: false,
      keyboardZoom: false,
      friction: 0.15,
      hfov: HFOV_FIXO,
      minHfov: HFOV_FIXO,
      maxHfov: HFOV_FIXO,
      pitch: 0,
      yaw: 0,
      backgroundColor: [0x19 / 255, 0x1c / 255, 0x1f / 255],
      strings: {
        noPanoramaError: t("conta.panorama360.mensagensVisualizador.semImagem"),
        fileAccessError: t("conta.panorama360.mensagensVisualizador.arquivoInacessivel"),
        genericWebGLError: t("conta.panorama360.mensagensVisualizador.semSuporteWebGL"),
        textureSizeError: t("conta.panorama360.mensagensVisualizador.tamanhoExcedido"),
        unknownError: t("conta.panorama360.mensagensVisualizador.erroDesconhecido"),
      },
    });

    viewerRef.current = viewer;

    viewer.on("load", () => {
      if (!cancelado) setCarregandoImagem(false);
    });

    viewer.on("error", (...args: unknown[]) => {
      if (cancelado) return;
      const mensagem =
        typeof args[0] === "string" ? args[0] : t("conta.panorama360.mensagensVisualizador.erroDesconhecido");
      setCarregandoImagem(false);
      aoFalhar(mensagem);
    });

    return () => {
      cancelado = true;
      viewer.destroy();
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    function aoMudarTelaCheia() {
      const ativo = document.fullscreenElement === envolucroRef.current;
      setEmTelaCheia(ativo);
      // O canvas do Pannellum precisa ser redimensionado manualmente após a
      // transição de/para tela cheia, já que ela muda as dimensões do
      // contentor fora do ciclo normal de resize da janela.
      requestAnimationFrame(() => viewerRef.current?.resize());
    }

    document.addEventListener("fullscreenchange", aoMudarTelaCheia);
    return () => document.removeEventListener("fullscreenchange", aoMudarTelaCheia);
  }, []);

  const aoResetar = useCallback(() => {
    viewerRef.current?.stopAutoRotate();
    setAutoRotateAtivo(false);
    viewerRef.current?.lookAt(0, 0, HFOV_FIXO, 600);
  }, []);

  const aoAlternarAutoRotate = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (autoRotateAtivo) {
      viewer.stopAutoRotate();
    } else {
      viewer.startAutoRotate(VELOCIDADE_AUTOROTATE);
    }
    setAutoRotateAtivo((v) => !v);
  }, [autoRotateAtivo]);

  const aoAlternarTelaCheia = useCallback(() => {
    if (!envolucroRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      envolucroRef.current.requestFullscreen?.().catch(() => {});
    }
  }, []);

  return (
    <div
      ref={envolucroRef}
      className="relative h-full w-full overflow-hidden bg-fundo"
      data-tela-cheia={emTelaCheia || undefined}
    >
      <div ref={containerRef} className="absolute inset-0" />

      <AnimatePresence>
        {carregandoImagem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-fundo"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-9 w-9 rounded-full border-2 border-borda border-t-marca"
              aria-hidden="true"
            />
            <p className="text-sm text-texto-secundario">{t("conta.panorama360.carregando")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!carregandoImagem && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 sm:bottom-6">
          <ControlesPanorama
            autoRotateAtivo={autoRotateAtivo}
            emTelaCheia={emTelaCheia}
            aoResetar={aoResetar}
            aoAlternarAutoRotate={aoAlternarAutoRotate}
            aoAlternarTelaCheia={aoAlternarTelaCheia}
          />
        </div>
      )}
    </div>
  );
}
