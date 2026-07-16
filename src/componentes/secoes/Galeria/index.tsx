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

        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((coluna) => (
            <div key={coluna} className="flex flex-col gap-3">
              {itensGaleria
                .filter((_, i) => i % 3 === coluna)
                .map((item, i) => (
                  <QuadroGaleria
                    key={item.id}
                    item={item}
                    indice={i * 3 + coluna}
                    aoClicar={definirItemSelecionado}
                  />
                ))}
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
