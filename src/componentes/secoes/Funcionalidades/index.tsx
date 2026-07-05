import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import CartaoFuncionalidade from "../../ui/CartaoFuncionalidade";
import { iconesFuncionalidades } from "../../../dados/funcionalidades";

interface FuncionalidadeTraducao {
  titulo: string;
  descricao: string;
}

export default function Funcionalidades() {
  const { t } = useTranslation();
  const itens = t("funcionalidades.itens", { returnObjects: true }) as FuncionalidadeTraducao[];

  return (
    <section id="recursos" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="04"
          marcador={t("funcionalidades.marcador")}
          titulo={t("funcionalidades.titulo")}
        />

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map((item, i) => (
            <CartaoFuncionalidade
              key={item.titulo}
              icone={iconesFuncionalidades[i]}
              titulo={item.titulo}
              descricao={item.descricao}
              numero={`F.${String(i + 1).padStart(2, "0")}`}
              indice={i}
              destacado={i === 0}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
