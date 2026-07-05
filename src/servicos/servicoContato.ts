import type { ValoresFormularioContato } from "../tipos";

export interface ResultadoEnvio {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Serviço placeholder para envio do formulário de contato.
 * Substitua o corpo desta função por uma chamada real de API quando o
 * backend estiver disponível.
 */
export async function enviarFormularioContato(
  valores: ValoresFormularioContato
): Promise<ResultadoEnvio> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (!valores.email.includes("@")) {
    return { sucesso: false, mensagem: "Informe um e-mail válido." };
  }

  console.info("[servicoContato] formulário enviado (placeholder):", valores);

  return {
    sucesso: true,
    mensagem: "Mensagem enviada com sucesso! Em breve entraremos em contato.",
  };
}
