import type { ParametrosRender } from "../tipos";

// Moods escuros forçam luz artificial ligada mesmo que o usuário não tenha
// ligado manualmente — senão o render sai preto/inútil. Aplicar SEMPRE antes
// de montar qualquer prompt.
export function normalizarParametros(parametros: ParametrosRender): ParametrosRender {
  const precisaForcarLuz =
    (parametros.hora === "noite" || parametros.hora === "sem luz natural" || parametros.hora === "blue hour") &&
    (parametros.temperatura === "desligado" || !parametros.temperatura);

  if (!precisaForcarLuz) return parametros;

  return {
    ...parametros,
    temperatura: parametros.hora === "blue hour" ? "4000K" : "3000K",
  };
}
