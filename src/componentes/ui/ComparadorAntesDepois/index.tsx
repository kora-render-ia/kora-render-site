import { useTranslation } from "react-i18next";
import { HiArrowsRightLeft, HiOutlineArrowsPointingOut } from "react-icons/hi2";
import { useControleDeslizante } from "../../../ganchos/useControleDeslizante";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesComparadorAntesDepois {
  imagemAntes: string;
  imagemDepois: string;
  rotuloAntes: string;
  rotuloDepois: string;
  descricaoAria: string;
  className?: string;
  style?: React.CSSProperties;
  aoExpandir?: () => void;
  prioridade?: boolean;
}

export default function ComparadorAntesDepois({
  imagemAntes,
  imagemDepois,
  rotuloAntes,
  rotuloDepois,
  descricaoAria,
  className,
  style,
  aoExpandir,
  prioridade = false,
}: PropriedadesComparadorAntesDepois) {
  const { t } = useTranslation();
  const { referenciaContentor, posicao, aoPressionar, aoMover, aoSoltar, aoPressionarTecla } =
    useControleDeslizante(50);

  return (
    <div
      ref={referenciaContentor}
      className={mesclarClasses("relative w-full select-none overflow-hidden", className)}
      style={style}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
    >
      <img
        src={imagemDepois}
        alt={`${descricaoAria} — ${rotuloDepois}`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={prioridade ? "high" : "auto"}
      />
      <span className="numero-tecnico absolute right-3 top-3 rounded-selo border border-marca/40 bg-fundo-elevado/85 px-2.5 py-1 text-[11px] uppercase text-marca backdrop-blur-sm">
        {rotuloDepois}
      </span>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}>
        <img
          src={imagemAntes}
          alt={`${descricaoAria} — ${rotuloAntes}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading={prioridade ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={prioridade ? "high" : "auto"}
        />
        <span className="numero-tecnico absolute left-3 top-3 rounded-selo border border-borda-forte bg-fundo-elevado/85 px-2.5 py-1 text-[11px] uppercase text-texto-primario backdrop-blur-sm">
          {rotuloAntes}
        </span>
      </div>

      <div className="absolute inset-y-0 z-10 w-px bg-marca" style={{ left: `${posicao}%` }}>
        <button
          type="button"
          onPointerDown={aoPressionar}
          onKeyDown={aoPressionarTecla}
          role="slider"
          aria-label={descricaoAria}
          aria-valuenow={Math.round(posicao)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-marca bg-fundo-elevado text-marca shadow-suave"
        >
          <HiArrowsRightLeft size={14} aria-hidden="true" />
        </button>
      </div>

      {aoExpandir && (
        <button
          type="button"
          onClick={aoExpandir}
          aria-label={t("comuns.ampliar", "Ampliar imagem")}
          className="numero-tecnico absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-borda bg-fundo-elevado/85 text-texto-primario shadow-suave backdrop-blur-sm transition-colors hover:border-marca hover:text-marca"
        >
          <HiOutlineArrowsPointingOut size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
