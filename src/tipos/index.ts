export type IdCategoriaGaleria =
  "salas" | "cozinhas" | "quartos" | "banheiros" | "fachadas" | "areas-externas";

export interface ItemGaleria {
  id: string;
  imagem: string;
  categoria: IdCategoriaGaleria;
}

export interface ItemCompatibilidade {
  id: string;
  rotulo: string;
  suportado: boolean;
  icone?: "check" | "windows" | "mac";
}

export interface ValoresFormularioContato {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}
