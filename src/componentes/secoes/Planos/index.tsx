import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import CartaoPlano from "../../ui/CartaoPlano";
import { planoEmDestaque } from "../../../dados/planos";

interface PlanoTraducao {
  nome: string;
  preco: string;
  periodo: string;
  descricao: string;
  recursos: string[];
  rotuloCta: string;
  selo?: string;
}

export default function Planos() {
  const { t } = useTranslation();
  const planos = t("planos.planos", { returnObjects: true }) as PlanoTraducao[];

  return (
    <section id="planos" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="08"
          marcador={t("planos.marcador")}
          titulo={t("planos.titulo")}
          descricao={t("planos.subtitulo")}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {planos.map((plano, i) => (
            <CartaoPlano
              key={plano.nome}
              nome={plano.nome}
              preco={plano.preco}
              periodo={plano.periodo}
              descricao={plano.descricao}
              recursos={plano.recursos}
              rotuloCta={plano.rotuloCta}
              selo={plano.selo}
              emDestaque={planoEmDestaque[i]}
              indice={i}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
