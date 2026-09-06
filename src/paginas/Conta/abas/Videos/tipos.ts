export interface InfoImagemVideo {
  dataUrl: string;
  nomeArquivo: string;
  largura: number;
  altura: number;
  ratio: string;
}

export interface PillMovimento {
  id: string;
  chaveRotulo: string;
  frase: string;
}

export interface GrupoPills {
  chaveRotulo: string;
  pills: PillMovimento[];
}

export interface ItemHistoricoVideo {
  id: string;
  urlVideo: string;
  prompt: string;
  duracao: 5 | 10;
  criadoEm: string;
}

export type EstadoVideo =
  | { fase: "sem-chave" }
  | { fase: "sem-imagem" }
  | { fase: "carregando-imagem" }
  | { fase: "configurando"; imagem: InfoImagemVideo }
  | { fase: "gerando"; imagem: InfoImagemVideo; taskId: string; tentativa: number }
  | { fase: "pronto"; imagem: InfoImagemVideo; urlVideo: string }
  | {
      fase: "erro";
      mensagem: string;
      faseAnterior: "sem-imagem" | "configurando" | "gerando";
      imagem?: InfoImagemVideo;
    };
