import { useTranslation } from "react-i18next";
import { mesclarClasses } from "../../../../../../utilitarios/mesclarClasses";

const OPCOES: { valor: 5 | 10; chaveRotulo: string }[] = [
  { valor: 5, chaveRotulo: "conta.videos.duracao.opcao5s" },
  { valor: 10, chaveRotulo: "conta.videos.duracao.opcao10s" },
];

interface PropriedadesSeletorDuracaoVideo {
  duracao: 5 | 10;
  aoMudar: (duracao: 5 | 10) => void;
}

export default function SeletorDuracaoVideo({ duracao, aoMudar }: PropriedadesSeletorDuracaoVideo) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-xs font-medium text-texto-secundario">{t("conta.videos.duracao.rotulo")}</p>
      <div className="mt-2 flex gap-2">
        {OPCOES.map((opcao) => {
          const ativa = duracao === opcao.valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => aoMudar(opcao.valor)}
              aria-pressed={ativa}
              className={mesclarClasses(
                "numero-tecnico rounded-botao border px-4 py-2 text-sm transition-colors",
                ativa
                  ? "border-marca bg-marca-suave text-marca"
                  : "border-borda text-texto-secundario hover:border-acento-soft hover:text-texto-primario"
              )}
            >
              {t(opcao.chaveRotulo)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
