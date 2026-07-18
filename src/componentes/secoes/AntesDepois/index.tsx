import { useTranslation } from "react-i18next";
import { HiArrowsRightLeft } from "react-icons/hi2";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import MoldeCantos from "../../ui/MoldeCantos";
import { useControleDeslizante } from "../../../ganchos/useControleDeslizante";
import { imagensAntesDepois } from "../../../dados/antesDepois";

export default function AntesDepois() {
  const { t } = useTranslation();
  const { referenciaContentor, posicao, aoPressionar, aoMover, aoSoltar, aoPressionarTecla } =
    useControleDeslizante(50);

  const rotuloAntes = t("antesDepois.rotuloAntes");
  const rotuloDepois = t("antesDepois.rotuloDepois");

  return (
    <section id="antes-depois" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="02"
          marcador={t("antesDepois.marcador")}
          titulo={t("antesDepois.titulo")}
          descricao={t("antesDepois.descricao")}
        />

        <MoldeCantos className="mt-10" corCanto="marca">
          <div
            ref={referenciaContentor}
            className="relative aspect-[16/10] w-full select-none overflow-hidden border border-borda sm:aspect-[21/9]"
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
          >
            <img
              src={imagensAntesDepois.depois}
              alt={`${t("antesDepois.titulo")} — ${rotuloDepois}`}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <span className="numero-tecnico absolute right-4 top-4 rounded-selo border border-marca/40 bg-fundo-elevado/85 px-2.5 py-1 text-[11px] uppercase text-marca backdrop-blur-sm">
              {rotuloDepois}
            </span>

            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}
            >
              <img
                src={imagensAntesDepois.antes}
                alt={`${t("antesDepois.titulo")} — ${rotuloAntes}`}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <span className="numero-tecnico absolute left-4 top-4 rounded-selo border border-borda-forte bg-fundo-elevado/85 px-2.5 py-1 text-[11px] uppercase text-texto-primario backdrop-blur-sm">
                {rotuloAntes}
              </span>
            </div>

            <div className="absolute inset-y-0 z-10 w-px bg-marca" style={{ left: `${posicao}%` }}>
              <button
                type="button"
                onPointerDown={aoPressionar}
                onKeyDown={aoPressionarTecla}
                role="slider"
                aria-label={t("antesDepois.descricao")}
                aria-valuenow={Math.round(posicao)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-marca bg-fundo-elevado text-marca shadow-suave"
              >
                <HiArrowsRightLeft size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </MoldeCantos>
      </Contentor>
    </section>
  );
}
