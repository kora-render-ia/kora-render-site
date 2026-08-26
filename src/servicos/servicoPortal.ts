import type { RespostaPortal } from "../tipos";

// Se VITE_API_URL não for definida no build, cai pra API de produção — nunca
// pra localhost, pra não quebrar um deploy real esquecido de configurar.
const URL_BASE = import.meta.env.VITE_API_URL || "https://api.korarender.com.br";

const CHAVE_TOKEN = "kr_portal_token";

export function obterTokenSalvo(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function limparTokenSalvo(): void {
  localStorage.removeItem(CHAVE_TOKEN);
}

interface RespostaApi<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function chamarApi<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });

  const corpo = (await resposta.json().catch(() => ({}))) as RespostaApi<T>;

  if (!resposta.ok || !corpo.success) {
    throw new Error(corpo.message || "Não foi possível comunicar com o servidor.");
  }

  return corpo.data as T;
}

export const servicoPortal = {
  async login(email: string, licenseKey: string): Promise<RespostaPortal> {
    const resultado = await chamarApi<RespostaPortal>("/api/portal/login", {
      method: "POST",
      body: JSON.stringify({ email, license_key: licenseKey }),
    });
    if (resultado.token) localStorage.setItem(CHAVE_TOKEN, resultado.token);
    return resultado;
  },

  async me(): Promise<RespostaPortal> {
    const token = obterTokenSalvo();
    if (!token) throw new Error("Sem sessão salva.");

    return chamarApi<RespostaPortal>("/api/portal/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async esqueciLicenca(email: string): Promise<void> {
    await chamarApi<{ message: string }>("/api/auth/forgot-license", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  logout(): void {
    limparTokenSalvo();
  },
};
