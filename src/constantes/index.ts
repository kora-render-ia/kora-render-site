export const NOME_SITE = "Lumi";
export const EMAIL_CONTATO = "lumirender.ia@gmail.com";

// TODO: substitua pelo domínio final de produção (mantenha sincronizado com
// index.html, public/robots.txt e public/sitemap.xml). Pode ser sobrescrito
// em build/deploy via a variável de ambiente VITE_SITE_URL.
export const URL_SITE = (import.meta.env.VITE_SITE_URL || "https://SEU-DOMINIO.com.br").replace(
  /\/$/,
  ""
);

// Mantenha sincronizado com o <title> e a <meta name="description"> em index.html.
export const TITULO_PADRAO = "Seu SketchUp agora também cria imagens fotorrealistas com IA";
export const DESCRICAO_PADRAO =
  "Transforme seus modelos do SketchUp em imagens fotorrealistas em segundos com o Lumi, o plugin de renderização por inteligência artificial para arquitetos e designers.";

export const IDS_SECAO = {
  destaque: "destaque",
  antesDepois: "antes-depois",
  comoFunciona: "como-funciona",
  funcionalidades: "recursos",
  galeria: "galeria",
  compatibilidade: "compatibilidade",
  planos: "planos",
  depoimentos: "depoimentos",
  perguntasFrequentes: "faq",
} as const;
