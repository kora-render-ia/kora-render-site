import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi2";
import { mesclarClasses } from "../../../../../../utilitarios/mesclarClasses";
import { catalogoPillsAmbiente } from "../../dados/catalogoPillsMovimento";

interface PropriedadesSeletorPillsMovimento {
  pillsSelecionadas: string[];
  aoAlternarPill: (id: string) => void;
  textoLivre: string;
  aoMudarTexto: (valor: string) => void;
}

export default function SeletorPillsMovimento({
  pillsSelecionadas,
  aoAlternarPill,
  textoLivre,
  aoMudarTexto,
}: PropriedadesSeletorPillsMovimento) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {catalogoPillsAmbiente.map((grupo) => (
        <div key={grupo.chaveRotulo}>
          <p className="numero-tecnico text-[11px] uppercase tracking-wide text-texto-suave">
            {t(grupo.chaveRotulo)}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {grupo.pills.map((pill) => {
              const ativa = pillsSelecionadas.includes(pill.id);
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => aoAlternarPill(pill.id)}
                  aria-pressed={ativa}
                  className={mesclarClasses(
                    "inline-flex items-center gap-1.5 rounded-selo border px-3 py-1.5 text-[13px] transition-colors",
                    ativa
                      ? "border-marca/60 bg-marca-suave text-marca"
                      : "border-borda text-texto-secundario hover:border-acento-soft hover:text-texto-primario"
                  )}
                >
                  {ativa && <HiCheck size={13} aria-hidden="true" />}
                  {t(pill.chaveRotulo)}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-texto-secundario">
          {t("conta.videos.textoLivre.rotulo")}
        </span>
        <textarea
          value={textoLivre}
          onChange={(e) => aoMudarTexto(e.target.value)}
          placeholder={t("conta.videos.textoLivre.marcador")}
          rows={3}
          className="w-full resize-none rounded-botao border border-borda bg-fundo-elevado px-4 py-2.5 text-sm text-texto-primario placeholder:text-texto-suave focus:border-marca focus:outline-none"
        />
        <span className="text-xs text-texto-suave">{t("conta.videos.textoLivre.dica")}</span>
      </label>
    </div>
  );
}
