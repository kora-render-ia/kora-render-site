import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi2";
import { mesclarClasses } from "../../../../../../utilitarios/mesclarClasses";
import { catalogoMovimentosCamera } from "../../dados/catalogoPillsMovimento";
import type { IdMovimentoCamera } from "../../tipos";

interface PropriedadesSeletorMovimentoCamera {
  movimento: IdMovimentoCamera;
  aoEscolher: (id: IdMovimentoCamera) => void;
}

export default function SeletorMovimentoCamera({ movimento, aoEscolher }: PropriedadesSeletorMovimentoCamera) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="numero-tecnico text-[11px] uppercase tracking-wide text-texto-suave">
        {t("conta.videos.camera.tituloSecao")}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {catalogoMovimentosCamera.map((item) => {
          const ativo = movimento === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => aoEscolher(item.id)}
              aria-pressed={ativo}
              className={mesclarClasses(
                "inline-flex items-center gap-1.5 rounded-selo border px-3 py-1.5 text-[13px] transition-colors",
                ativo
                  ? "border-marca/60 bg-marca-suave text-marca"
                  : "border-borda text-texto-secundario hover:border-acento-soft hover:text-texto-primario"
              )}
            >
              {ativo && <HiCheck size={13} aria-hidden="true" />}
              {t(item.chaveRotulo)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
