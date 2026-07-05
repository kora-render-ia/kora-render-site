import BarraNavegacao from "../../componentes/leiaute/BarraNavegacao";
import Rodape from "../../componentes/leiaute/Rodape";
import Destaque from "../../componentes/secoes/Destaque";
import AntesDepois from "../../componentes/secoes/AntesDepois";
import FaixaVersoes from "../../componentes/secoes/FaixaVersoes";
import ComoFunciona from "../../componentes/secoes/ComoFunciona";
import Funcionalidades from "../../componentes/secoes/Funcionalidades";
import Galeria from "../../componentes/secoes/Galeria";
import Videos from "../../componentes/secoes/Videos";
import Compatibilidade from "../../componentes/secoes/Compatibilidade";
import Planos from "../../componentes/secoes/Planos";
import Depoimentos from "../../componentes/secoes/Depoimentos";
import PerguntasFrequentes from "../../componentes/secoes/PerguntasFrequentes";
import ChamadaAcao from "../../componentes/secoes/ChamadaAcao";

export default function Inicio() {
  return (
    <>
      <BarraNavegacao />
      <main>
        <Destaque />
        <AntesDepois />
        <FaixaVersoes />
        <ComoFunciona />
        <Funcionalidades />
        <Galeria />
        <Videos />
        <Compatibilidade />
        <Planos />
        <Depoimentos />
        <PerguntasFrequentes />
        <ChamadaAcao />
      </main>
      <Rodape />
    </>
  );
}
