import { useState } from "react";
import { useTranslation } from "react-i18next";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import ItemPergunta from "../../ui/ItemPergunta";
import { EMAIL_CONTATO } from "../../../constantes";

interface PerguntaTraducao {
  pergunta: string;
  resposta: string;
}

export default function PerguntasFrequentes() {
  const { t } = useTranslation();
  const itens = t("perguntasFrequentes.itens", { returnObjects: true }) as PerguntaTraducao[];
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Contentor className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <CabecalhoSecao
            numero="10"
            marcador={t("perguntasFrequentes.marcador")}
            titulo={t("perguntasFrequentes.titulo")}
          />
          <p className="mt-4 text-sm text-texto-secundario">
            {t("perguntasFrequentes.textoAjuda")}{" "}
            <a href={`mailto:${EMAIL_CONTATO}`} className="text-marca hover:underline">
              {EMAIL_CONTATO}
            </a>
          </p>
        </div>

        <div>
          {itens.map((item, i) => (
            <ItemPergunta
              key={item.pergunta}
              indice={i}
              pergunta={item.pergunta}
              resposta={item.resposta}
              aberto={indiceAberto === i}
              aoAlternar={() => setIndiceAberto((atual) => (atual === i ? null : i))}
            />
          ))}
        </div>
      </Contentor>
    </section>
  );
}
