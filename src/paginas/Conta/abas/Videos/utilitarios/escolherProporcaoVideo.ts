// Únicos 6 valores aceitos pela Runway (HTTP 400 fora disso) — a ordem aqui
// decide o desempate quando duas proporções ficam igualmente próximas.
const RATIOS_RUNWAY: { valor: string; razao: number }[] = [
  { valor: "1280:720", razao: 1280 / 720 },
  { valor: "1584:672", razao: 1584 / 672 },
  { valor: "960:960", razao: 1 },
  { valor: "1104:832", razao: 1104 / 832 },
  { valor: "832:1104", razao: 832 / 1104 },
  { valor: "720:1280", razao: 720 / 1280 },
];

// Escolhe sempre pela menor diferença numérica em relação à razão real da
// imagem — nunca por faixas/buckets.
export function escolherProporcaoVideo(largura: number, altura: number): string {
  const razaoAlvo = largura / altura;

  let melhor = RATIOS_RUNWAY[0];
  let menorDiferenca = Math.abs(razaoAlvo - melhor.razao);

  for (const candidato of RATIOS_RUNWAY.slice(1)) {
    const diferenca = Math.abs(razaoAlvo - candidato.razao);
    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca;
      melhor = candidato;
    }
  }

  return melhor.valor;
}
