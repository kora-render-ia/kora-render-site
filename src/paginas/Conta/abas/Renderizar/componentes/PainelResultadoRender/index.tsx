import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { HiOutlineArrowDownTray, HiOutlineExclamationTriangle } from "react-icons/hi2";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";

interface PropriedadesPainelResultadoRender {
  dataUrl: string;
  avisos: string[];
  aoRefinar: (prompt: string) => void;
  aoGerarOutro: () => void;
}

export default function PainelResultadoRender({
  dataUrl,
  avisos,
  aoRefinar,
  aoGerarOutro,
}: PropriedadesPainelResultadoRender) {
  const { t } = useTranslation();
  const [promptRefinamento, setPromptRefinamento] = useState("");

  function aoEnviarRefinamento() {
    const valor = promptRefinamento.trim();
    if (!valor) return;
    aoRefinar(valor);
    setPromptRefinamento("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      {avisos.length > 0 && (
        <div className="mb-4 flex flex-col gap-1.5">
          {avisos.map((aviso, i) => (
            <p key={i} className="flex items-start gap-2 text-xs text-aviso">
              <HiOutlineExclamationTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {aviso}
            </p>
          ))}
        </div>
      )}

      <MoldeCantos corCanto="marca">
        <div className="overflow-hidden rounded-quadro border border-borda bg-fundo-elevado">
          <img src={dataUrl} alt="" className="w-full bg-black" />
        </div>
      </MoldeCantos>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Botao
          href={dataUrl}
          download="render-lumi.png"
          variante="secundario"
          icone={<HiOutlineArrowDownTray size={15} aria-hidden="true" />}
        >
          {t("conta.renderizar.pronto.baixar")}
        </Botao>
        <Botao aoClicar={aoGerarOutro}>{t("conta.renderizar.pronto.gerarOutro")}</Botao>
      </div>

      <div className="mt-6 border-t border-borda pt-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-texto-secundario">
            {t("conta.renderizar.refinar.rotulo")}
          </span>
          <textarea
            value={promptRefinamento}
            onChange={(e) => setPromptRefinamento(e.target.value)}
            rows={2}
            placeholder={t("conta.renderizar.refinar.marcador")}
            className="w-full resize-none rounded-botao border border-borda bg-fundo-elevado px-3 py-2 text-sm text-texto-primario placeholder:text-texto-suave focus:border-marca focus:outline-none"
          />
        </label>
        <Botao
          tamanho="md"
          className="mt-3 w-full"
          aoClicar={aoEnviarRefinamento}
          desabilitado={!promptRefinamento.trim()}
        >
          {t("conta.renderizar.refinar.botao")}
        </Botao>
      </div>
    </motion.div>
  );
}
