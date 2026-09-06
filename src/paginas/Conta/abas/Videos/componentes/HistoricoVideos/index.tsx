import { useTranslation } from "react-i18next";
import { HiOutlineTrash, HiOutlinePlay } from "react-icons/hi2";
import type { ItemHistoricoVideo } from "../../tipos";

interface PropriedadesHistoricoVideos {
  itens: ItemHistoricoVideo[];
  aoRemover: (id: string) => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function HistoricoVideos({ itens, aoRemover }: PropriedadesHistoricoVideos) {
  const { t } = useTranslation();

  if (itens.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-texto-suave">{t("conta.videos.historico.vazio")}</p>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl">
      <p className="numero-tecnico text-[11px] uppercase tracking-wide text-texto-suave">
        {t("conta.videos.historico.titulo")}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {itens.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-botao border border-borda bg-fundo-elevado px-4 py-3"
          >
            <a
              href={item.urlVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-borda text-texto-secundario transition-colors hover:border-marca hover:text-marca"
              aria-label={t("conta.videos.pronto.baixar")}
            >
              <HiOutlinePlay size={13} aria-hidden="true" />
            </a>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-texto-primario">{item.prompt}</p>
              <p className="numero-tecnico text-[11px] text-texto-suave">
                {formatarData(item.criadoEm)} · {item.duracao}s
              </p>
            </div>
            <button
              type="button"
              onClick={() => aoRemover(item.id)}
              className="shrink-0 text-texto-suave transition-colors hover:text-erro"
              aria-label={t("conta.videos.historico.remover")}
            >
              <HiOutlineTrash size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
