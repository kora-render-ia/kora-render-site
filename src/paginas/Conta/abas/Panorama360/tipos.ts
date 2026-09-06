export interface InfoImagemPanorama {
  url: string;
  nomeArquivo: string;
  largura: number;
  altura: number;
  proporcaoForaDoPadrao: boolean;
}

export type EstadoPanorama =
  | { fase: "vazio" }
  | { fase: "carregando" }
  | { fase: "pronto"; info: InfoImagemPanorama }
  | { fase: "erro"; mensagem: string };
