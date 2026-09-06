import { useRef, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { HiOutlineCloudArrowUp, HiOutlineExclamationTriangle } from "react-icons/hi2";
import Botao from "../../../../../../componentes/comuns/Botao";
import { mesclarClasses } from "../../../../../../utilitarios/mesclarClasses";

const TIPOS_ACEITOS = "image/jpeg,image/png,image/webp";

interface PropriedadesUploadPanorama {
  aoSelecionarArquivo: (arquivo: File) => void;
  erro: string | null;
}

export default function UploadPanorama({ aoSelecionarArquivo, erro }: PropriedadesUploadPanorama) {
  const { t } = useTranslation();
  const referenciaInput = useRef<HTMLInputElement>(null);
  const [arrastandoSobre, setArrastandoSobre] = useState(false);

  function abrirSeletor() {
    referenciaInput.current?.click();
  }

  function aoMudarArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (arquivo) aoSelecionarArquivo(arquivo);
  }

  function aoArrastarSobre(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastandoSobre(true);
  }

  function aoSairDoArraste(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastandoSobre(false);
  }

  function aoSoltarArquivo(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastandoSobre(false);
    const arquivo = evento.dataTransfer.files?.[0];
    if (arquivo) aoSelecionarArquivo(arquivo);
  }

  return (
    <div className="w-full">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={abrirSeletor}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && abrirSeletor()}
        onDragOver={aoArrastarSobre}
        onDragEnter={aoArrastarSobre}
        onDragLeave={aoSairDoArraste}
        onDrop={aoSoltarArquivo}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={mesclarClasses(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-quadro border border-dashed px-6 py-16 text-center transition-colors duration-200 sm:py-24",
          arrastandoSobre
            ? "border-marca bg-marca-suave/40"
            : "border-borda-forte bg-fundo-elevado hover:border-acento-soft"
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-borda bg-superficie text-marca">
          <HiOutlineCloudArrowUp size={26} aria-hidden="true" />
        </span>

        <div>
          <p className="font-titulo text-lg font-semibold text-texto-primario">
            {t("conta.panorama360.upload.tituloArraste")}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-texto-suave">
            {t("conta.panorama360.upload.ou")}
          </p>
        </div>

        <Botao
          type="button"
          variante="secundario"
          tamanho="md"
          aoClicar={(e) => {
            e.stopPropagation();
            abrirSeletor();
          }}
        >
          {t("conta.panorama360.upload.botaoSelecionar")}
        </Botao>

        <p className="max-w-sm text-xs leading-relaxed text-texto-suave">
          {t("conta.panorama360.upload.formatosAceitos")}
        </p>

        <input
          ref={referenciaInput}
          type="file"
          accept={TIPOS_ACEITOS}
          onChange={aoMudarArquivo}
          className="sr-only"
          aria-label={t("conta.panorama360.upload.botaoSelecionar")}
        />
      </motion.div>

      {erro && (
        <p className="mt-4 flex items-center gap-2 text-sm text-erro">
          <HiOutlineExclamationTriangle size={16} className="shrink-0" aria-hidden="true" />
          {erro}
        </p>
      )}
    </div>
  );
}
