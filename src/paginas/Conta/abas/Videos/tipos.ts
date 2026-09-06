export interface InfoImagemVideo {
  dataUrl: string;
  blob: Blob;
  nomeArquivo: string;
  largura: number;
  altura: number;
}

export type ModoGeracao = "camera" | "ia";

export type IdMovimentoCamera =
  | "zoom-in"
  | "zoom-out"
  | "deslizamento-horizontal"
  | "rotacionar"
  | "movimento-orbital";

export interface MovimentoCamera {
  id: IdMovimentoCamera;
  chaveRotulo: string;
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

// Só vídeos gerados por IA (URL remota, permanente) entram no histórico —
// vídeos do parallax local usam blob: URLs que não sobrevivem a um reload,
// então não fazem sentido persistidos.
export interface ItemHistoricoVideo {
  id: string;
  urlVideo: string;
  prompt: string;
  duracao: 5 | 10;
  criadoEm: string;
}

// O modo (câmera local vs IA paga) é um estado independente da fase — decide
// só o que aparece dentro de "configurando"/"erro com imagem", não muda a
// máquina de estados em si.
export type EstadoVideo =
  | { fase: "sem-imagem" }
  | { fase: "carregando-imagem" }
  | { fase: "configurando"; imagem: InfoImagemVideo }
  | { fase: "gerando-camera"; imagem: InfoImagemVideo; etapa: "profundidade" | "renderizando" }
  | { fase: "gerando-ia"; imagem: InfoImagemVideo; taskId: string; tentativa: number }
  | { fase: "pronto"; imagem: InfoImagemVideo; urlVideo: string }
  | { fase: "erro"; mensagem: string; imagem?: InfoImagemVideo };
