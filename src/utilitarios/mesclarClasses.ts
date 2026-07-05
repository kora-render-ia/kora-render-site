type ValorClasse = string | number | boolean | null | undefined | ValorClasse[];

function paraListaDeClasses(valor: ValorClasse, saida: string[]): void {
  if (!valor) return;
  if (Array.isArray(valor)) {
    valor.forEach((item) => paraListaDeClasses(item, saida));
    return;
  }
  saida.push(String(valor));
}

/**
 * Combina classes condicionalmente, sem dependência externa.
 * Uso: mesclarClasses("base", condicao && "ativo", ["a", "b"])
 */
export function mesclarClasses(...valores: ValorClasse[]): string {
  const saida: string[] = [];
  valores.forEach((v) => paraListaDeClasses(v, saida));
  return saida.join(" ");
}
