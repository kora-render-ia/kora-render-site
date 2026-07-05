export interface OpcaoIdioma {
  codigo: "pt-BR" | "en";
  chaveRotulo: string;
}

export const opcoesIdioma: OpcaoIdioma[] = [
  { codigo: "pt-BR", chaveRotulo: "idioma.pt-BR" },
  { codigo: "en", chaveRotulo: "idioma.en" },
];
