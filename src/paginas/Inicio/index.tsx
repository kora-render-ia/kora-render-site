import { useTranslation } from "react-i18next";
import BarraNavegacao from "../../componentes/leiaute/BarraNavegacao";
import Rodape from "../../componentes/leiaute/Rodape";
import Destaque from "../../componentes/secoes/Destaque";
import AntesDepois from "../../componentes/secoes/AntesDepois";
import FaixaVersoes from "../../componentes/secoes/FaixaVersoes";
import ComoFunciona from "../../componentes/secoes/ComoFunciona";
import Funcionalidades from "../../componentes/secoes/Funcionalidades";
import Galeria from "../../componentes/secoes/Galeria";
import Compatibilidade from "../../componentes/secoes/Compatibilidade";
import Planos from "../../componentes/secoes/Planos";
import Depoimentos from "../../componentes/secoes/Depoimentos";
import PerguntasFrequentes from "../../componentes/secoes/PerguntasFrequentes";
import ChamadaAcao from "../../componentes/secoes/ChamadaAcao";
import { useMetadadosPagina } from "../../ganchos/useMetadadosPagina";
import { NOME_SITE, TITULO_PADRAO, DESCRICAO_PADRAO, URL_SITE } from "../../constantes";

interface PerguntaTraducao {
  pergunta: string;
  resposta: string;
}

function construirDadosEstruturados(
  t: (chave: string, opcoes?: Record<string, unknown>) => unknown
): object[] {
  const perguntas = t("perguntasFrequentes.itens", { returnObjects: true }) as PerguntaTraducao[];

  const organizacao = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: NOME_SITE,
    url: URL_SITE,
    logo: `${URL_SITE}/favicon-lumi.png`,
  };

  const aplicativo = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lumi Render",
    applicationCategory: "DesignApplication",
    operatingSystem: "Windows",
    description: t("destaque.descricao") as string,
    url: URL_SITE,
    offers: {
      "@type": "Offer",
      price: t("planos.precoSchema") as string,
      priceCurrency: t("planos.moedaSchema") as string,
      url: `${URL_SITE}/#planos`,
      availability: "https://schema.org/InStock",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: { "@type": "Answer", text: item.resposta },
    })),
  };

  return [organizacao, aplicativo, faq];
}

export default function Inicio() {
  const { t } = useTranslation();

  useMetadadosPagina({
    titulo: TITULO_PADRAO,
    descricao: DESCRICAO_PADRAO,
    caminho: "/",
    dadosEstruturados: construirDadosEstruturados(t),
  });

  return (
    <>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-botao focus:bg-fundo-elevado focus:px-4 focus:py-2 focus:text-sm focus:text-texto-primario focus:shadow-quadro"
      >
        {t("comuns.pularParaConteudo", "Pular para o conteúdo")}
      </a>
      <BarraNavegacao />
      <main id="conteudo-principal">
        <Destaque />
        <AntesDepois />
        <FaixaVersoes />
        <ComoFunciona />
        <Funcionalidades />
        <Galeria />
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
