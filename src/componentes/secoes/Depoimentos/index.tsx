import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import CitacaoDepoimento from "../../ui/CitacaoDepoimento";
import { metaDepoimentos } from "../../../dados/planos";

interface DepoimentoTraducao {
  nome: string;
  cargo: string;
  citacao: string;
}

export default function Depoimentos() {
  const { t } = useTranslation();
  const itens = t("depoimentos.itens", { returnObjects: true }) as DepoimentoTraducao[];

  return (
    <section className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="09"
          marcador={t("depoimentos.marcador")}
          titulo={t("depoimentos.titulo")}
        />

        <div className="mt-8">
          {itens.map((item, i) => (
            <CitacaoDepoimento
              key={item.nome}
              numero={String(i + 1).padStart(2, "0")}
              nome={item.nome}
              cargo={item.cargo}
              citacao={item.citacao}
              nota={metaDepoimentos[i].nota}
              indice={i}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
