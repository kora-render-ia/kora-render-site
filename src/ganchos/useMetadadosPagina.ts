import { useEffect } from "react";
import { URL_SITE } from "../constantes";

interface OpcoesMetadadosPagina {
  titulo: string;
  descricao: string;
  caminho: string;
  semIndexacao?: boolean;
  dadosEstruturados?: object[];
}

function obterOuCriarMeta(nome: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${nome}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = nome;
    document.head.appendChild(el);
  }
  return el;
}

/**
 * Sincroniza title, description, robots, canonical e JSON-LD do <head> com a
 * rota atual. Necessário porque o app é uma SPA client-side (um único
 * index.html) — sem isso, toda rota herdaria os metadados estáticos da home.
 * Restaura os valores anteriores ao desmontar, para não vazar metadados de
 * uma rota para outra durante a navegação client-side.
 */
export function useMetadadosPagina({
  titulo,
  descricao,
  caminho,
  semIndexacao = false,
  dadosEstruturados,
}: OpcoesMetadadosPagina) {
  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = titulo;

    const metaDescricao = obterOuCriarMeta("description");
    const descricaoAnterior = metaDescricao.content;
    metaDescricao.content = descricao;

    const metaRobots = obterOuCriarMeta("robots");
    const robotsAnterior = metaRobots.content;
    metaRobots.content = semIndexacao ? "noindex, nofollow" : "index, follow";

    let linkCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalFoiCriado = !linkCanonical;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    const canonicalAnterior = linkCanonical.href;
    linkCanonical.href = `${URL_SITE}${caminho}`;

    const scriptsJsonLd = (dadosEstruturados ?? []).map((dados) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(dados);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      document.title = tituloAnterior;
      metaDescricao.content = descricaoAnterior;
      metaRobots.content = robotsAnterior;
      if (canonicalFoiCriado) {
        linkCanonical?.remove();
      } else if (linkCanonical) {
        linkCanonical.href = canonicalAnterior;
      }
      scriptsJsonLd.forEach((script) => script.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, descricao, caminho, semIndexacao, JSON.stringify(dadosEstruturados)]);
}
