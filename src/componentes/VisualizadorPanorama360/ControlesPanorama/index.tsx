import { useTranslation } from "react-i18next";
import {
  HiOutlineArrowPath,
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
  HiOutlineViewfinderCircle,
} from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesControlesPanorama {
  autoRotateAtivo: boolean;
  emTelaCheia: boolean;
  aoResetar: () => void;
  aoAlternarAutoRotate: () => void;
  aoAlternarTelaCheia: () => void;
}

export default function ControlesPanorama({
  autoRotateAtivo,
  emTelaCheia,
  aoResetar,
  aoAlternarAutoRotate,
  aoAlternarTelaCheia,
}: PropriedadesControlesPanorama) {
  const { t } = useTranslation();

  const classeBotao =
    "flex h-10 w-10 items-center justify-center rounded-botao border border-borda bg-fundo-elevado/95 text-texto-primario shadow-suave backdrop-blur-sm transition-colors hover:border-marca hover:text-marca sm:h-11 sm:w-11";
  const classeBotaoAtivo = "border-marca/60 bg-marca-suave text-marca";

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-quadro border border-borda bg-fundo-elevado/80 p-1.5 shadow-quadro backdrop-blur-sm">
      <button
        type="button"
        onClick={aoResetar}
        aria-label={t("conta.panorama360.controles.resetar")}
        title={t("conta.panorama360.controles.resetar")}
        className={classeBotao}
      >
        <HiOutlineViewfinderCircle size={17} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={aoAlternarAutoRotate}
        aria-pressed={autoRotateAtivo}
        aria-label={t(
          autoRotateAtivo
            ? "conta.panorama360.controles.autoRotateDesativar"
            : "conta.panorama360.controles.autoRotateAtivar"
        )}
        title={t(
          autoRotateAtivo
            ? "conta.panorama360.controles.autoRotateDesativar"
            : "conta.panorama360.controles.autoRotateAtivar"
        )}
        className={mesclarClasses(classeBotao, autoRotateAtivo && classeBotaoAtivo)}
      >
        <HiOutlineArrowPath size={17} aria-hidden="true" />
      </button>

      <span className="mx-0.5 h-6 w-px bg-borda" aria-hidden="true" />

      <button
        type="button"
        onClick={aoAlternarTelaCheia}
        aria-pressed={emTelaCheia}
        aria-label={t(
          emTelaCheia
            ? "conta.panorama360.controles.telaCheiaDesativar"
            : "conta.panorama360.controles.telaCheiaAtivar"
        )}
        title={t(
          emTelaCheia
            ? "conta.panorama360.controles.telaCheiaDesativar"
            : "conta.panorama360.controles.telaCheiaAtivar"
        )}
        className={classeBotao}
      >
        {emTelaCheia ? (
          <HiOutlineArrowsPointingIn size={17} aria-hidden="true" />
        ) : (
          <HiOutlineArrowsPointingOut size={17} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
