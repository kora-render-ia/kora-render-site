import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import FitaVideo from "../../ui/FitaVideo";
import { duracoesVideos } from "../../../dados/videos";

interface VideoTraducao {
  titulo: string;
}

export default function Videos() {
  const { t } = useTranslation();
  const itens = t("videos.itens", { returnObjects: true }) as VideoTraducao[];

  return (
    <section id="videos" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao numero="06" marcador={t("videos.marcador")} titulo={t("videos.titulo")} />

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map((item, i) => (
            <FitaVideo
              key={item.titulo}
              titulo={item.titulo}
              codigoTempo={`00:0${duracoesVideos[i]}:00`}
              indice={i}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
