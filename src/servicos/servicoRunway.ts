// Cliente para as 2 serverless functions locais (api/runway/*) que fazem o
// proxy pra Runway — a Runway não aceita chamadas diretas do navegador
// (sem suporte a CORS). A chave BYOK do usuário nunca é salva aqui, só
// repassada por requisição.

export interface RespostaCriarTarefaRunway {
  id?: string;
  error?: unknown;
}

export interface RespostaStatusTarefaRunway {
  status?: string;
  output?: string[];
  error?: unknown;
}

interface ParametrosCriarTarefa {
  apiKey: string;
  promptImage: string;
  promptText: string;
  ratio: string;
  duration: 5 | 10;
}

async function consultarStatusInterno(
  apiKey: string,
  taskId: string
): Promise<{ status: number; corpo: RespostaStatusTarefaRunway }> {
  const resposta = await fetch(`/api/runway/task-status?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const corpo = (await resposta.json().catch(() => ({}))) as RespostaStatusTarefaRunway;
  return { status: resposta.status, corpo };
}

// UUID inválido só pra testar a chave: 401 = chave inválida, qualquer outra
// resposta (ex.: 404 "task not found") = a autenticação passou.
const UUID_TESTE_CHAVE = "00000000-0000-0000-0000-000000000000";

export const servicoRunway = {
  async criarTarefa(
    params: ParametrosCriarTarefa
  ): Promise<{ status: number; corpo: RespostaCriarTarefaRunway }> {
    const resposta = await fetch("/api/runway/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const corpo = (await resposta.json().catch(() => ({}))) as RespostaCriarTarefaRunway;
    return { status: resposta.status, corpo };
  },

  consultarStatus: consultarStatusInterno,

  async validarChave(apiKey: string): Promise<boolean> {
    const { status } = await consultarStatusInterno(apiKey, UUID_TESTE_CHAVE);
    return status !== 401;
  },
};
