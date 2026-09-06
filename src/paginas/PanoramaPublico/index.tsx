import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import VisualizadorPanorama from "../../componentes/VisualizadorPanorama360";
import { NOME_SITE } from "../../constantes";
import { useMetadadosPagina } from "../../ganchos/useMetadadosPagina";
import logoLumi from "../../ativos/logo/lumi-completa.png";

// Só aceitamos URLs do próprio storage do Vercel Blob usado pelo upload de
// compartilhamento — evita que o link vire um jeito de fazer esta página
// carregar (e parecer endossar) qualquer URL arbitrária de terceiros.
function ehUrlDeBlobConfiavel(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export default function PanoramaPublico() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const urlParametro = searchParams.get("u") ?? "";
  const [erroVisualizador, setErroVisualizador] = useState<string | null>(null);

  const urlPanorama = useMemo(
    () => (ehUrlDeBlobConfiavel(urlParametro) ? urlParametro : null),
    [urlParametro]
  );

  useMetadadosPagina({
    titulo: t("panoramaPublico.tituloPagina", { nome: NOME_SITE }),
    descricao: t("panoramaPublico.descricaoPagina"),
    caminho: "/panorama",
    semIndexacao: true,
  });

  return (
    <div className="flex h-screen w-full flex-col bg-fundo">
      <header className="flex h-14 shrink-0 items-center border-b border-borda px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <img src={logoLumi} alt={NOME_SITE} width={500} height={150} className="h-6 w-auto object-contain" />
        </Link>
      </header>

      <div className="relative flex-1">
        {urlPanorama && !erroVisualizador ? (
          <VisualizadorPanorama url={urlPanorama} aoFalhar={setErroVisualizador} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <HiOutlineExclamationTriangle size={28} className="text-aviso" aria-hidden="true" />
            <p className="max-w-sm text-sm text-texto-secundario">
              {erroVisualizador ?? t("panoramaPublico.linkInvalido")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
