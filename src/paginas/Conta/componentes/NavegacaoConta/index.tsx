import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowDownTray, HiOutlineGlobeAlt, HiOutlineSparkles } from "react-icons/hi2";
import { mesclarClasses } from "../../../../utilitarios/mesclarClasses";
import type { LicencaPortal, StatusLicencaPortal } from "../../../../tipos";

const CORES_STATUS: Record<StatusLicencaPortal, string> = {
  ACTIVE: "border-sucesso/30 bg-sucesso/10 text-sucesso",
  BLOCKED: "border-erro/30 bg-erro/10 text-erro",
  EXPIRED: "border-aviso/30 bg-aviso/10 text-aviso",
  REFUNDED: "border-erro/30 bg-erro/10 text-erro",
  CANCELED: "border-texto-suave/30 bg-superficie text-texto-secundario",
};

// A aba "videos" (parallax de câmera) fica oculta da navegação por ora — o
// resultado ainda está simples demais para ser um item de destaque no menu.
// A rota em Conta/index.tsx continua registrada, então links diretos não quebram.
const itensNavegacao = [
  { chave: "downloads", para: "/conta", fim: true, Icone: HiOutlineArrowDownTray },
  { chave: "renderizar", para: "/conta/renderizar", fim: false, Icone: HiOutlineSparkles },
  { chave: "panorama360", para: "/conta/360", fim: false, Icone: HiOutlineGlobeAlt },
] as const;

interface PropriedadesNavegacaoConta {
  license: LicencaPortal;
  aoSair: () => void;
}

export default function NavegacaoConta({ license, aoSair }: PropriedadesNavegacaoConta) {
  const { t } = useTranslation();

  return (
    <nav className="flex shrink-0 flex-col border-b border-borda lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-6 py-5 lg:flex-col lg:items-start lg:gap-3">
        <div className="flex min-w-0 items-center gap-2.5 lg:w-full lg:flex-col lg:items-start lg:gap-2">
          <p className="truncate text-sm font-medium text-texto-primario">
            {t("conta.painel.saudacao", { nome: license.name })}
          </p>
          <span
            className={mesclarClasses(
              "inline-flex shrink-0 items-center rounded-selo border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide",
              CORES_STATUS[license.status]
            )}
          >
            {t(`conta.status.${license.status}`)}
          </span>
        </div>
        <button
          type="button"
          onClick={aoSair}
          className="shrink-0 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline lg:hidden"
        >
          {t("conta.painel.sair")}
        </button>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0">
        {itensNavegacao.map((item, i) => (
          <li key={item.chave} className="shrink-0 lg:shrink">
            <NavLink
              to={item.para}
              end={item.fim}
              className={({ isActive }) =>
                mesclarClasses(
                  "numero-tecnico flex items-center gap-2.5 whitespace-nowrap rounded-botao px-3 py-2.5 text-[13px] transition-colors",
                  isActive
                    ? "bg-marca-suave text-marca"
                    : "text-texto-secundario hover:bg-superficie-hover hover:text-texto-primario"
                )
              }
            >
              <item.Icone size={16} aria-hidden="true" />
              <span className="text-[10px] text-texto-suave">{String(i + 1).padStart(2, "0")}</span>
              {t(`conta.nav.${item.chave}`)}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto hidden px-6 py-5 lg:block">
        <button
          type="button"
          onClick={aoSair}
          className="text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline"
        >
          {t("conta.painel.sair")}
        </button>
      </div>
    </nav>
  );
}
