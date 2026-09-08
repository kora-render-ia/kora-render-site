import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiXMark } from "react-icons/hi2";

interface PropriedadesVisualizadorResultadoRender {
  dataUrl: string | null;
  aoFechar: () => void;
}

// Mesmo padrão do VisualizadorGaleria (overlay fullscreen, Escape/backdrop
// fecham) — mas aqui o clique na própria imagem alterna entre "caber na
// tela" e "tamanho real em pixels com scroll", já que o objetivo é deixar
// examinar detalhe fino do render (2K/4K), não só ver uma versão maior.
export default function VisualizadorResultadoRender({ dataUrl, aoFechar }: PropriedadesVisualizadorResultadoRender) {
  const { t } = useTranslation();
  const [tamanhoReal, setTamanhoReal] = useState(false);

  useEffect(() => {
    if (!dataUrl) return;

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };

    document.addEventListener("keydown", aoPressionarTecla);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.style.overflow = "";
      setTamanhoReal(false);
    };
  }, [dataUrl, aoFechar]);

  return (
    <AnimatePresence>
      {dataUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-fundo/95 p-6 backdrop-blur-sm"
          onClick={aoFechar}
        >
          <button
            type="button"
            onClick={aoFechar}
            aria-label={t("comuns.fechar", "Fechar")}
            className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center border border-borda bg-superficie text-texto-primario transition-colors hover:border-marca hover:text-marca"
          >
            <HiXMark className="h-5 w-5" />
          </button>

          <div
            className={
              tamanhoReal
                ? "h-full w-full overflow-auto"
                : "pointer-events-none flex h-full w-full items-center justify-center"
            }
            // No modo "tamanho real" o wrapper precisa receber ponteiro pra
            // permitir scroll — nesse caso ele mesmo para a propagação (clicar
            // no espaço em volta da imagem, dentro da área de scroll, não
            // fecha). No modo "ajustado à tela" o wrapper ocupa o backdrop
            // inteiro, então fica com pointer-events-none pra deixar cliques
            // fora da imagem chegarem no backdrop e fechar o visualizador.
            onClick={tamanhoReal ? (evento) => evento.stopPropagation() : undefined}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={dataUrl}
              alt=""
              onClick={(evento) => {
                evento.stopPropagation();
                setTamanhoReal((v) => !v);
              }}
              className={
                tamanhoReal
                  ? "mx-auto my-6 max-w-none cursor-zoom-out"
                  : "pointer-events-auto max-h-full max-w-full cursor-zoom-in object-contain"
              }
            />
          </div>

          <p className="numero-tecnico absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-wide text-texto-suave">
            {tamanhoReal
              ? t("conta.renderizar.pronto.clicandoParaAjustar")
              : t("conta.renderizar.pronto.clicandoParaAmpliar")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
