import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowLongRight } from "react-icons/hi2";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import QuadroGaleria from "../../ui/QuadroGaleria";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";
import { idsCategoriasGaleria, itensGaleria } from "../../../dados/galeria";
import type { IdCategoriaGaleria } from "../../../tipos";

type FiltroCategoria = IdCategoriaGaleria | "todos";

export default function Galeria() {
  const { t } = useTranslation();
  const [categoriaAtiva, setCategoriaAtiva] = useState<FiltroCategoria>("todos");

  const itensFiltrados = useMemo(
    () =>
      categoriaAtiva === "todos"
        ? itensGaleria
        : itensGaleria.filter((item) => item.categoria === categoriaAtiva),
    [categoriaAtiva]
  );

  return (
    <section id="galeria" className="py-20 lg:py-28">
      <Contentor className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_2.3fr]">
        <div>
          <CabecalhoSecao
            numero="05"
            marcador={t("galeria.marcador")}
            titulo={t("galeria.titulo")}
          />

          <ul className="mt-8 hidden flex-col lg:flex">
            {idsCategoriasGaleria.map((idCategoria) => {
              const ativo = categoriaAtiva === idCategoria;
              return (
                <li key={idCategoria} className="border-t border-borda last:border-b">
                  <button
                    type="button"
                    onClick={() => setCategoriaAtiva(idCategoria as FiltroCategoria)}
                    className={mesclarClasses(
                      "flex w-full items-center justify-between py-3 text-left text-sm transition-colors",
                      ativo ? "text-marca" : "text-texto-secundario hover:text-texto-primario"
                    )}
                  >
                    {t(`galeria.categorias.${idCategoria}`)}
                    {ativo && <HiArrowLongRight size={16} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
            {idsCategoriasGaleria.map((idCategoria) => (
              <button
                key={idCategoria}
                type="button"
                onClick={() => setCategoriaAtiva(idCategoria as FiltroCategoria)}
                className={mesclarClasses(
                  "border px-3 py-1.5 text-xs transition-colors",
                  categoriaAtiva === idCategoria
                    ? "border-marca text-marca"
                    : "border-borda text-texto-secundario"
                )}
              >
                {t(`galeria.categorias.${idCategoria}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-end gap-2 text-texto-suave">
            <span className="numero-tecnico text-[11px] uppercase tracking-wide">
              {t("galeria.dica")}
            </span>
            <HiArrowLongRight size={14} aria-hidden="true" />
          </div>
          <div className="scrollbar-none flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {itensFiltrados.map((item, i) => (
              <QuadroGaleria key={item.id} item={item} indice={i} />
            ))}
          </div>
        </div>
      </Contentor>
    </section>
  );
}
