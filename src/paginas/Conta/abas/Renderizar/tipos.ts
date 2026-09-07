export type TipoProjeto =
  | "interior residencial"
  | "exterior residencial"
  | "exterior comercial"
  | "interior comercial"
  | "paisagismo";

export type Mood =
  | "dia"
  | "luz marcada"
  | "golden hour"
  | "blue hour"
  | "meio-dia"
  | "fim do dia"
  | "noite"
  | "sem luz natural"
  | "luz difusa"
  | "overcast"
  | "ceu brasileiro";

export type TemperaturaLuz = "desligado" | "5500K" | "4000K" | "3000K";
export type Proporcao = "1:1" | "4:3" | "16:9" | "9:16" | "4:5";
export type Qualidade = "2K" | "4K";
export type Vista =
  | "nenhum"
  | "jardim"
  | "jardim_residencial"
  | "mata"
  | "mata_densa"
  | "montanhas"
  | "mar"
  | "cidade";
export type ModeloIA = "pro" | "banana2";
export type Clima = "" | "editorial" | "clean" | "aconchegante" | "sofisticado" | "ludico";

export interface ParametrosRender {
  tipo: TipoProjeto;
  hora: Mood;
  temperatura: TemperaturaLuz;
  proporcao: Proporcao;
  qualidade: Qualidade;
  vista: Vista;
  prompt: string;
  modeloIa: ModeloIA;
  clima: Clima;
}

export interface InfoImagemRender {
  dataUrl: string;
  base64Png: string;
  nomeArquivo: string;
  largura: number;
  altura: number;
}

export interface ResultadoRender {
  imagemBase64: string;
  mimeType: string;
  larguraReal: number;
  alturaReal: number;
  avisoResolucao: string | null;
  avisoFallback: string | null;
}

// Registro leve só da sessão atual (nunca persistido) — imagens em base64
// facilmente estourariam a cota do localStorage depois de poucos renders em
// 2K/4K, diferente do histórico de vídeos (que guarda só uma URL remota).
export interface ItemHistoricoRender {
  id: string;
  dataUrl: string;
  criadoEm: string;
}

export type EstadoRender =
  | { fase: "sem-imagem" }
  | { fase: "carregando-imagem" }
  | { fase: "configurando"; imagem: InfoImagemRender; parametros: ParametrosRender }
  | {
      fase: "gerando";
      imagem: InfoImagemRender;
      parametros: ParametrosRender;
      etapa: "catalogo" | "render" | "refinamento";
    }
  | { fase: "pronto"; imagem: InfoImagemRender; resultado: ResultadoRender; parametros: ParametrosRender }
  | { fase: "erro"; mensagem: string; imagem?: InfoImagemRender; parametros?: ParametrosRender };
