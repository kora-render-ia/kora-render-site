import { useState } from "react";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import QuadroGaleria from "../../ui/QuadroGaleria";
import VisualizadorGaleria from "../../ui/VisualizadorGaleria";
import { itensGaleria } from "../../../dados/galeria";
import type { ItemGaleria } from "../../../tipos";

export default function Galeria() {
  const { t } = useTranslation();
  const [itemSelecionado, definirItemSelecionado] = useState<ItemGaleria | null>(null);

  return (
    <section id="galeria" className="py-20 lg:py-28">
      <Contentor className="flex flex-col gap-10">
        <CabecalhoSecao
          numero="05"
          marcador={t("galeria.marcador")}
          titulo={t("galeria.titulo")}
        />

        <div className="columns-1 gap-3 sm:columns-3">
          {itensGaleria.map((item, i) => (
            <div key={item.id} className="mb-3 break-inside-avoid">
              <QuadroGaleria item={item} indice={i} aoClicar={definirItemSelecionado} />
            </div>
          ))}
        </div>
      </Contentor>

      <VisualizadorGaleria
        item={itemSelecionado}
        aoFechar={() => definirItemSelecionado(null)}
      />
    </section>
  );
}
