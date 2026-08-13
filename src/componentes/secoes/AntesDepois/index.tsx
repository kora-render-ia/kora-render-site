import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Contentor from "../../comuns/Contentor";
import CabecalhoSecao from "../../comuns/CabecalhoSecao";
import MoldeCantos from "../../ui/MoldeCantos";
import ComparadorAntesDepois from "../../ui/ComparadorAntesDepois";
import VisualizadorAntesDepois, {
  type ItemAntesDepoisExpandido,
} from "../../ui/VisualizadorAntesDepois";
import { exemplosAntesDepois } from "../../../dados/antesDepois";

export default function AntesDepois() {
  const { t } = useTranslation();
  const rotuloAntes = t("antesDepois.rotuloAntes");
  const rotuloDepois = t("antesDepois.rotuloDepois");
  const [itemExpandido, definirItemExpandido] = useState<ItemAntesDepoisExpandido | null>(null);

  return (
    <section id="antes-depois" className="py-20 lg:py-28">
      <Contentor>
        <CabecalhoSecao
          numero="02"
          marcador={t("antesDepois.marcador")}
          titulo={t("antesDepois.titulo")}
          descricao={t("antesDepois.descricao")}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.26 }}
          className="mt-16 grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-3"
        >
          {exemplosAntesDepois.map((exemplo, indice) => {
            const descricaoAria = `${t("antesDepois.descricao")} ${indice + 1}`;
            return (
              <MoldeCantos
                key={indice}
                className={indice !== 1 ? "sm:mx-auto sm:w-[94%]" : undefined}
              >
                <ComparadorAntesDepois
                  imagemAntes={exemplo.antes}
                  imagemDepois={exemplo.depois}
                  rotuloAntes={rotuloAntes}
                  rotuloDepois={rotuloDepois}
                  descricaoAria={descricaoAria}
                  style={{ aspectRatio: exemplo.proporcao }}
                  aoExpandir={() =>
                    definirItemExpandido({
                      antes: exemplo.antes,
                      depois: exemplo.depois,
                      proporcao: exemplo.proporcao,
                      descricaoAria,
                    })
                  }
                />
              </MoldeCantos>
            );
          })}
        </motion.div>
      </Contentor>

      <VisualizadorAntesDepois
        item={itemExpandido}
        rotuloAntes={rotuloAntes}
        rotuloDepois={rotuloDepois}
        aoFechar={() => definirItemExpandido(null)}
      />
    </section>
  );
}
