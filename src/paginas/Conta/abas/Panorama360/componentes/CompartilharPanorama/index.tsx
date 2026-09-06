import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineLink, HiOutlineCheck, HiOutlineClipboard } from "react-icons/hi2";
import Botao from "../../../../../../componentes/comuns/Botao";
import { compartilharPanorama } from "../../../../../../servicos/servicoCompartilharPanorama";

interface PropriedadesCompartilharPanorama {
  arquivo: File;
}

type EstadoCompartilhamento =
  | { fase: "ocioso" }
  | { fase: "enviando" }
  | { fase: "pronto"; link: string }
  | { fase: "erro"; mensagem: string };

export default function CompartilharPanorama({ arquivo }: PropriedadesCompartilharPanorama) {
  const { t } = useTranslation();
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<EstadoCompartilhamento>({ fase: "ocioso" });
  const [copiado, setCopiado] = useState(false);
  const linkPublicoRef = useRef<string | null>(null);
  const envolucroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (!envolucroRef.current?.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  const aoAbrir = useCallback(async () => {
    const abrindo = !aberto;
    setAberto(abrindo);
    if (!abrindo) return;

    if (linkPublicoRef.current) {
      setEstado({ fase: "pronto", link: linkPublicoRef.current });
      return;
    }
    if (estado.fase === "enviando") return;

    setEstado({ fase: "enviando" });
    try {
      const urlArquivo = await compartilharPanorama(arquivo);
      const linkPublico = `${window.location.origin}/panorama?u=${encodeURIComponent(urlArquivo)}`;
      linkPublicoRef.current = linkPublico;
      setEstado({ fase: "pronto", link: linkPublico });
    } catch {
      setEstado({ fase: "erro", mensagem: t("conta.panorama360.compartilhar.erro") });
    }
  }, [aberto, arquivo, estado.fase, t]);

  const aoCopiar = useCallback(async () => {
    if (estado.fase !== "pronto") return;
    try {
      await navigator.clipboard.writeText(estado.link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Clipboard API pode falhar (permissão negada, contexto não seguro);
      // o link já está selecionável no campo, então não é um caminho sem saída.
    }
  }, [estado]);

  return (
    <div ref={envolucroRef} className="relative shrink-0">
      <Botao
        variante="fantasma"
        tamanho="sm"
        icone={<HiOutlineLink size={14} aria-hidden="true" />}
        posicaoIcone="esquerda"
        aoClicar={aoAbrir}
      >
        {t("conta.panorama360.compartilhar.botao")}
      </Botao>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-10 mt-2 w-72 rounded-quadro border border-borda bg-fundo-elevado p-4 shadow-quadro sm:w-80"
          >
            {estado.fase === "enviando" && (
              <p className="text-xs text-texto-secundario">{t("conta.panorama360.compartilhar.enviando")}</p>
            )}

            {estado.fase === "erro" && <p className="text-xs text-erro">{estado.mensagem}</p>}

            {estado.fase === "pronto" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-texto-secundario">{t("conta.panorama360.compartilhar.descricao")}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={estado.link}
                    onFocus={(e) => e.currentTarget.select()}
                    className="numero-tecnico min-w-0 flex-1 rounded-botao border border-borda bg-fundo px-2.5 py-2 text-xs text-texto-primario focus:border-marca focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={aoCopiar}
                    aria-label={t("conta.panorama360.compartilhar.copiar")}
                    title={t("conta.panorama360.compartilhar.copiar")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-botao border border-borda text-texto-primario transition-colors hover:border-marca hover:text-marca"
                  >
                    {copiado ? (
                      <HiOutlineCheck size={14} className="text-sucesso" aria-hidden="true" />
                    ) : (
                      <HiOutlineClipboard size={14} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
