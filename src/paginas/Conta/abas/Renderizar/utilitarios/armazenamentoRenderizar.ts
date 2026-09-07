const CHAVE_API_KEY = "kr_google_api_key";

export function obterChaveGoogleIA(): string | null {
  return localStorage.getItem(CHAVE_API_KEY);
}

export function salvarChaveGoogleIA(chave: string): void {
  localStorage.setItem(CHAVE_API_KEY, chave);
}

export function removerChaveGoogleIA(): void {
  localStorage.removeItem(CHAVE_API_KEY);
}
