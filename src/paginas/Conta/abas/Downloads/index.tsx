import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Botao from "../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../componentes/ui/MoldeCantos";
import type { RespostaPortal } from "../../../../tipos";

function formatarData(iso: string, idioma: string): string {
  return new Date(iso).toLocaleDateString(idioma === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface PropriedadesAbaDownloads {
  sessao: RespostaPortal;
}

export default function AbaDownloads({ sessao }: PropriedadesAbaDownloads) {
  const { t, i18n } = useTranslation();
  const { license, plugin } = sessao;
  const [agora] = useState(() => Date.now());
  const naoExpirada = new Date(license.expires_at).getTime() > agora;
  const podeBaixar = license.status === "ACTIVE" && naoExpirada && !!plugin.download_url;

  return (
    <div className="mx-auto max-w-lg px-6 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <MoldeCantos corCanto="marca">
          <div className="rounded-quadro border border-borda bg-fundo-elevado p-8 sm:p-10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-texto-suave">
                  {t("conta.painel.plano")}
                </p>
                <p className="mt-1 font-medium text-texto-primario">{license.plan}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-texto-suave">
                  {t("conta.painel.validadeRotulo")}
                </p>
                <p className="mt-1 font-medium text-texto-primario">
                  {formatarData(license.expires_at, i18n.language)}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-borda pt-6">
              {podeBaixar ? (
                <>
                  <Botao href={plugin.download_url} tamanho="lg" className="w-full">
                    {t("conta.painel.baixarPlugin")}
                  </Botao>
                  <p className="mt-3 text-center text-xs text-texto-suave">
                    {t("conta.painel.versaoAtual", { versao: plugin.latest_version })}
                  </p>
                </>
              ) : (
                <p className="text-center text-sm text-texto-secundario">
                  {t("conta.painel.downloadIndisponivel")}
                </p>
              )}
            </div>
          </div>
        </MoldeCantos>
      </motion.div>
    </div>
  );
}
