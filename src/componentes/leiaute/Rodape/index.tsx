import { useTranslation } from "react-i18next";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import Contentor from "../../comuns/Contentor";
import { NOME_SITE } from "../../../constantes";

const redesSociais = [
  { id: "instagram", Icone: FaInstagram, href: "#" },
  { id: "youtube", Icone: FaYoutube, href: "#" },
  { id: "linkedin", Icone: FaLinkedin, href: "#" },
];

const chavesGrupos = ["produto", "empresa", "legal"] as const;
const linksGrupos: Record<(typeof chavesGrupos)[number], { chave: string; href: string }[]> = {
  produto: [
    { chave: "funcionalidades", href: "#recursos" },
    { chave: "planos", href: "#planos" },
    { chave: "galeria", href: "#galeria" },
  ],
  empresa: [
    { chave: "sobre", href: "#" },
    { chave: "contato", href: "#" },
    { chave: "blog", href: "#" },
  ],
  legal: [
    { chave: "privacidade", href: "#" },
    { chave: "termos", href: "#" },
  ],
};

export default function Rodape() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-borda">
      <Contentor className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#destaque" className="flex items-center gap-2.5 text-texto-primario">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-marca text-[13px] font-bold text-white">
                K
              </span>
              <span className="font-titulo text-lg font-semibold">{NOME_SITE}</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-texto-secundario">
              {t("rodape.descricao")}
            </p>
          </div>

          {chavesGrupos.map((chaveGrupo) => (
            <div key={chaveGrupo}>
              <p className="numero-tecnico text-[11px] uppercase tracking-wider text-texto-suave">
                {t(`rodape.grupos.${chaveGrupo}.titulo`)}
              </p>
              <ul className="mt-4 space-y-2.5">
                {linksGrupos[chaveGrupo].map((link) => (
                  <li key={link.chave}>
                    <a
                      href={link.href}
                      className="text-sm text-texto-secundario transition-colors hover:text-marca"
                    >
                      {t(`rodape.grupos.${chaveGrupo}.${link.chave}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-borda pt-6 sm:flex-row">
          <p className="numero-tecnico text-[11px] text-texto-suave">{t("rodape.copyright")}</p>
          <div className="flex items-center gap-4">
            {redesSociais.map((rede) => (
              <a
                key={rede.id}
                href={rede.href}
                aria-label={rede.id}
                className="text-texto-suave transition-colors hover:text-marca"
              >
                <rede.Icone size={15} />
              </a>
            ))}
          </div>
        </div>
      </Contentor>
    </footer>
  );
}
