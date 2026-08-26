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

// Espelha o formato retornado por POST /api/portal/login e GET /api/portal/me
// da API de licenciamento (kora-render-api). Ver StatusLicenca em
// src/types/index.ts daquele repo.
export type StatusLicencaPortal = "ACTIVE" | "BLOCKED" | "EXPIRED" | "REFUNDED" | "CANCELED";

export interface LicencaPortal {
  name: string;
  email: string;
  license_key: string;
  plan: string;
  status: StatusLicencaPortal;
  expires_at: string;
}

export interface RespostaPortal {
  token?: string;
  license: LicencaPortal;
  plugin: {
    latest_version: string;
    download_url: string;
  };
}
