import { useTranslation } from "react-i18next";
import { HiOutlineSparkles, HiOutlineVideoCamera } from "react-icons/hi2";
import { mesclarClasses } from "../../../../../../utilitarios/mesclarClasses";
import type { ModoGeracao } from "../../tipos";

interface PropriedadesSeletorModoGeracao {
  modo: ModoGeracao;
  aoMudar: (modo: ModoGeracao) => void;
}

export default function SeletorModoGeracao({ modo, aoMudar }: PropriedadesSeletorModoGeracao) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2 rounded-quadro border border-borda bg-fundo-elevado p-1.5">
      <button
        type="button"
        onClick={() => aoMudar("camera")}
        aria-pressed={modo === "camera"}
        className={mesclarClasses(
          "flex flex-col items-center gap-1 rounded-botao px-4 py-3 text-center transition-colors",
          modo === "camera"
            ? "bg-marca-suave text-marca"
            : "text-texto-secundario hover:bg-superficie-hover hover:text-texto-primario"
        )}
      >
        <HiOutlineVideoCamera size={18} aria-hidden="true" />
        <span className="text-sm font-medium">{t("conta.videos.modo.camera.titulo")}</span>
        <span className="text-[11px] text-texto-suave">{t("conta.videos.modo.camera.descricao")}</span>
      </button>

      <button
        type="button"
        onClick={() => aoMudar("ia")}
        aria-pressed={modo === "ia"}
        className={mesclarClasses(
          "flex flex-col items-center gap-1 rounded-botao px-4 py-3 text-center transition-colors",
          modo === "ia"
            ? "bg-marca-suave text-marca"
            : "text-texto-secundario hover:bg-superficie-hover hover:text-texto-primario"
        )}
      >
        <HiOutlineSparkles size={18} aria-hidden="true" />
        <span className="text-sm font-medium">{t("conta.videos.modo.ia.titulo")}</span>
        <span className="text-[11px] text-texto-suave">{t("conta.videos.modo.ia.descricao")}</span>
      </button>
    </div>
  );
}
