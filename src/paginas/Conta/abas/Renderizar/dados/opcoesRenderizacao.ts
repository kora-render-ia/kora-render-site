import type { Clima, Mood, ModeloIA, Proporcao, Qualidade, TemperaturaLuz, TipoProjeto, Vista } from "../tipos";

interface Opcao<T extends string> {
  valor: T;
  chaveRotulo: string;
}

export const OPCOES_TIPO: Opcao<TipoProjeto>[] = [
  { valor: "interior residencial", chaveRotulo: "conta.renderizar.opcoes.tipo.interiorResidencial" },
  { valor: "exterior residencial", chaveRotulo: "conta.renderizar.opcoes.tipo.exteriorResidencial" },
  { valor: "exterior comercial", chaveRotulo: "conta.renderizar.opcoes.tipo.exteriorComercial" },
  { valor: "interior comercial", chaveRotulo: "conta.renderizar.opcoes.tipo.interiorComercial" },
  { valor: "paisagismo", chaveRotulo: "conta.renderizar.opcoes.tipo.paisagismo" },
];

export const OPCOES_HORA: Opcao<Mood>[] = [
  { valor: "dia", chaveRotulo: "conta.renderizar.opcoes.hora.dia" },
  { valor: "luz marcada", chaveRotulo: "conta.renderizar.opcoes.hora.luzMarcada" },
  { valor: "golden hour", chaveRotulo: "conta.renderizar.opcoes.hora.goldenHour" },
  { valor: "blue hour", chaveRotulo: "conta.renderizar.opcoes.hora.blueHour" },
  { valor: "meio-dia", chaveRotulo: "conta.renderizar.opcoes.hora.meioDia" },
  { valor: "fim do dia", chaveRotulo: "conta.renderizar.opcoes.hora.fimDoDia" },
  { valor: "noite", chaveRotulo: "conta.renderizar.opcoes.hora.noite" },
  { valor: "sem luz natural", chaveRotulo: "conta.renderizar.opcoes.hora.semLuzNatural" },
  { valor: "luz difusa", chaveRotulo: "conta.renderizar.opcoes.hora.luzDifusa" },
  { valor: "overcast", chaveRotulo: "conta.renderizar.opcoes.hora.overcast" },
  { valor: "ceu brasileiro", chaveRotulo: "conta.renderizar.opcoes.hora.ceuBrasileiro" },
];

export const OPCOES_TEMPERATURA: Opcao<TemperaturaLuz>[] = [
  { valor: "desligado", chaveRotulo: "conta.renderizar.opcoes.temperatura.desligado" },
  { valor: "5500K", chaveRotulo: "conta.renderizar.opcoes.temperatura.5500k" },
  { valor: "4000K", chaveRotulo: "conta.renderizar.opcoes.temperatura.4000k" },
  { valor: "3000K", chaveRotulo: "conta.renderizar.opcoes.temperatura.3000k" },
];

export const OPCOES_PROPORCAO: Opcao<Proporcao>[] = [
  { valor: "1:1", chaveRotulo: "conta.renderizar.opcoes.proporcao.1x1" },
  { valor: "4:3", chaveRotulo: "conta.renderizar.opcoes.proporcao.4x3" },
  { valor: "16:9", chaveRotulo: "conta.renderizar.opcoes.proporcao.16x9" },
  { valor: "9:16", chaveRotulo: "conta.renderizar.opcoes.proporcao.9x16" },
  { valor: "4:5", chaveRotulo: "conta.renderizar.opcoes.proporcao.4x5" },
];

export const OPCOES_QUALIDADE: Opcao<Qualidade>[] = [
  { valor: "2K", chaveRotulo: "conta.renderizar.opcoes.qualidade.2k" },
  { valor: "4K", chaveRotulo: "conta.renderizar.opcoes.qualidade.4k" },
];

export const OPCOES_VISTA: Opcao<Vista>[] = [
  { valor: "nenhum", chaveRotulo: "conta.renderizar.opcoes.vista.nenhum" },
  { valor: "jardim", chaveRotulo: "conta.renderizar.opcoes.vista.jardim" },
  { valor: "jardim_residencial", chaveRotulo: "conta.renderizar.opcoes.vista.jardimResidencial" },
  { valor: "mata", chaveRotulo: "conta.renderizar.opcoes.vista.mata" },
  { valor: "mata_densa", chaveRotulo: "conta.renderizar.opcoes.vista.mataDensa" },
  { valor: "montanhas", chaveRotulo: "conta.renderizar.opcoes.vista.montanhas" },
  { valor: "mar", chaveRotulo: "conta.renderizar.opcoes.vista.mar" },
  { valor: "cidade", chaveRotulo: "conta.renderizar.opcoes.vista.cidade" },
];

export const OPCOES_MODELO_IA: Opcao<ModeloIA>[] = [
  { valor: "banana2", chaveRotulo: "conta.renderizar.opcoes.modeloIa.banana2" },
  { valor: "pro", chaveRotulo: "conta.renderizar.opcoes.modeloIa.pro" },
];

export const OPCOES_CLIMA: Opcao<Clima>[] = [
  { valor: "", chaveRotulo: "conta.renderizar.opcoes.clima.nenhum" },
  { valor: "editorial", chaveRotulo: "conta.renderizar.opcoes.clima.editorial" },
  { valor: "clean", chaveRotulo: "conta.renderizar.opcoes.clima.clean" },
  { valor: "aconchegante", chaveRotulo: "conta.renderizar.opcoes.clima.aconchegante" },
  { valor: "sofisticado", chaveRotulo: "conta.renderizar.opcoes.clima.sofisticado" },
  { valor: "ludico", chaveRotulo: "conta.renderizar.opcoes.clima.ludico" },
];

export const PARAMETROS_PADRAO: import("../tipos").ParametrosRender = {
  tipo: "interior residencial",
  hora: "dia",
  temperatura: "desligado",
  proporcao: "4:5",
  qualidade: "2K",
  vista: "nenhum",
  prompt: "",
  modeloIa: "banana2",
  clima: "",
};

export function tipoEhExterior(tipo: TipoProjeto): boolean {
  return tipo === "exterior residencial" || tipo === "exterior comercial" || tipo === "paisagismo";
}
