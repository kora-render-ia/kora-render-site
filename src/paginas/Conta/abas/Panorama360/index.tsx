import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamationTriangle, HiOutlineArrowUturnLeft } from "react-icons/hi2";
import Botao from "../../../../componentes/comuns/Botao";
import UploadPanorama from "./componentes/UploadPanorama";
import VisualizadorPanorama from "./componentes/VisualizadorPanorama";
import {
  arquivoEhImagemSuportada,
  lerDimensoesImagem,
  proporcaoForaDoPadraoPanoramico,
  LIMITE_MEGAPIXELS,
  LIMITE_TAMANHO_ARQUIVO_BYTES,
} from "./utilitarios/validarImagemPanorama";
import type { EstadoPanorama } from "./tipos";

export default function AbaPanorama360() {
  const { t } = useTranslation();
  const [estado, definirEstado] = useState<EstadoPanorama>({ fase: "vazio" });
  const urlAtualRef = useRef<string | null>(null);

  const liberarUrlAtual = useCallback(() => {
    if (urlAtualRef.current) {
      URL.revokeObjectURL(urlAtualRef.current);
      urlAtualRef.current = null;
    }
  }, []);

  useEffect(() => liberarUrlAtual, [liberarUrlAtual]);

  const aoSelecionarArquivo = useCallback(
    async (arquivo: File) => {
      liberarUrlAtual();
      definirEstado({ fase: "carregando" });

      if (!arquivoEhImagemSuportada(arquivo)) {
        definirEstado({ fase: "erro", mensagem: t("conta.panorama360.erros.tipoInvalido") });
        return;
      }

      if (arquivo.size > LIMITE_TAMANHO_ARQUIVO_BYTES) {
        definirEstado({
          fase: "erro",
          mensagem: t("conta.panorama360.erros.arquivoGrande", {
            limite: `${Math.round(LIMITE_TAMANHO_ARQUIVO_BYTES / (1024 * 1024))} MB`,
          }),
        });
        return;
      }

      const url = URL.createObjectURL(arquivo);

      try {
        const { largura, altura } = await lerDimensoesImagem(url);

        if (largura * altura > LIMITE_MEGAPIXELS) {
          URL.revokeObjectURL(url);
          definirEstado({ fase: "erro", mensagem: t("conta.panorama360.erros.imagemGrande") });
          return;
        }

        urlAtualRef.current = url;
        definirEstado({
          fase: "pronto",
          info: {
            url,
            nomeArquivo: arquivo.name,
            largura,
            altura,
            proporcaoForaDoPadrao: proporcaoForaDoPadraoPanoramico(largura, altura),
          },
        });
      } catch {
        URL.revokeObjectURL(url);
        definirEstado({ fase: "erro", mensagem: t("conta.panorama360.erros.leituraFalhou") });
      }
    },
    [liberarUrlAtual, t]
  );

  const aoTrocarImagem = useCallback(() => {
    liberarUrlAtual();
    definirEstado({ fase: "vazio" });
  }, [liberarUrlAtual]);

  const aoFalharVisualizador = useCallback(
    (mensagem: string) => {
      liberarUrlAtual();
      definirEstado({ fase: "erro", mensagem });
    },
    [liberarUrlAtual]
  );

  if (estado.fase === "pronto") {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-borda px-6 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-xs text-texto-suave">{estado.info.nomeArquivo}</p>
            {estado.info.proporcaoForaDoPadrao && (
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-aviso">
                <HiOutlineExclamationTriangle size={12} className="shrink-0" aria-hidden="true" />
                {t("conta.panorama360.avisoProporcao")}
              </p>
            )}
          </div>
          <Botao
            variante="fantasma"
            tamanho="sm"
            icone={<HiOutlineArrowUturnLeft size={14} aria-hidden="true" />}
            posicaoIcone="esquerda"
            aoClicar={aoTrocarImagem}
            className="shrink-0"
          >
            {t("conta.panorama360.trocarImagem")}
          </Botao>
        </div>

        <div className="relative flex-1">
          <VisualizadorPanorama url={estado.info.url} aoFalhar={aoFalharVisualizador} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center sm:py-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-titulo text-3xl font-bold tracking-tight text-texto-primario sm:text-4xl"
      >
        {t("conta.panorama360.titulo")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mt-3 max-w-md text-sm leading-relaxed text-texto-secundario"
      >
        {t("conta.panorama360.descricao")}
      </motion.p>

      <div className="mt-10 w-full">
        <AnimatePresence mode="wait">
          {estado.fase === "carregando" ? (
            <motion.div
              key="carregando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-quadro border border-borda bg-fundo-elevado px-6 py-16 sm:py-24"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-9 w-9 rounded-full border-2 border-borda border-t-marca"
                aria-hidden="true"
              />
              <p className="text-sm text-texto-secundario">{t("conta.panorama360.carregando")}</p>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UploadPanorama
                aoSelecionarArquivo={aoSelecionarArquivo}
                erro={estado.fase === "erro" ? estado.mensagem : null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
