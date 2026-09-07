import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";
import {
  OPCOES_TIPO,
  OPCOES_HORA,
  OPCOES_TEMPERATURA,
  OPCOES_PROPORCAO,
  OPCOES_QUALIDADE,
  OPCOES_VISTA,
  OPCOES_MODELO_IA,
  OPCOES_CLIMA,
  tipoEhExterior,
} from "../../dados/opcoesRenderizacao";
import type { InfoImagemRender, ParametrosRender } from "../../tipos";

interface PropriedadesPainelParametrosRender {
  imagem: InfoImagemRender;
  parametros: ParametrosRender;
  aoMudarParametros: (parametros: ParametrosRender) => void;
  aoGerar: () => void;
  aoTrocarImagem: () => void;
  gerando: boolean;
  etapa: "catalogo" | "render" | "refinamento" | null;
}

const classeCampo =
  "w-full rounded-botao border border-borda bg-fundo-elevado px-3 py-2 text-sm text-texto-primario focus:border-marca focus:outline-none";
const classeRotulo = "text-xs font-medium text-texto-secundario";

export default function PainelParametrosRender({
  imagem,
  parametros,
  aoMudarParametros,
  aoGerar,
  aoTrocarImagem,
  gerando,
  etapa,
}: PropriedadesPainelParametrosRender) {
  const { t } = useTranslation();

  function atualizar<K extends keyof ParametrosRender>(campo: K, valor: ParametrosRender[K]) {
    aoMudarParametros({ ...parametros, [campo]: valor });
  }

  const exterior = tipoEhExterior(parametros.tipo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      <MoldeCantos corCanto="marca">
        <div className="rounded-quadro border border-borda bg-fundo-elevado p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <img
              src={imagem.dataUrl}
              alt=""
              className="h-20 w-28 shrink-0 rounded-botao border border-borda object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-texto-primario">{imagem.nomeArquivo}</p>
              <button
                type="button"
                onClick={aoTrocarImagem}
                disabled={gerando}
                className="mt-1 text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline disabled:pointer-events-none disabled:opacity-40"
              >
                {t("conta.renderizar.trocarImagem")}
              </button>
            </div>
          </div>

          <fieldset disabled={gerando} className="mt-6 flex flex-col gap-4 border-t border-borda pt-6 disabled:opacity-50">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.tipo")}</span>
                <select
                  value={parametros.tipo}
                  onChange={(e) => atualizar("tipo", e.target.value as ParametrosRender["tipo"])}
                  className={classeCampo}
                >
                  {OPCOES_TIPO.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.hora")}</span>
                <select
                  value={parametros.hora}
                  onChange={(e) => atualizar("hora", e.target.value as ParametrosRender["hora"])}
                  className={classeCampo}
                >
                  {OPCOES_HORA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.temperatura")}</span>
                <select
                  value={parametros.temperatura}
                  onChange={(e) => atualizar("temperatura", e.target.value as ParametrosRender["temperatura"])}
                  className={classeCampo}
                >
                  {OPCOES_TEMPERATURA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              {!exterior && (
                <label className="flex flex-col gap-1.5">
                  <span className={classeRotulo}>{t("conta.renderizar.campos.vista")}</span>
                  <select
                    value={parametros.vista}
                    onChange={(e) => atualizar("vista", e.target.value as ParametrosRender["vista"])}
                    className={classeCampo}
                  >
                    {OPCOES_VISTA.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {t(opcao.chaveRotulo)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.proporcao")}</span>
                <select
                  value={parametros.proporcao}
                  onChange={(e) => atualizar("proporcao", e.target.value as ParametrosRender["proporcao"])}
                  className={classeCampo}
                >
                  {OPCOES_PROPORCAO.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.qualidade")}</span>
                <select
                  value={parametros.qualidade}
                  onChange={(e) => atualizar("qualidade", e.target.value as ParametrosRender["qualidade"])}
                  className={classeCampo}
                >
                  {OPCOES_QUALIDADE.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.modeloIa")}</span>
                <select
                  value={parametros.modeloIa}
                  onChange={(e) => atualizar("modeloIa", e.target.value as ParametrosRender["modeloIa"])}
                  className={classeCampo}
                >
                  {OPCOES_MODELO_IA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={classeRotulo}>{t("conta.renderizar.campos.clima")}</span>
                <select
                  value={parametros.clima}
                  onChange={(e) => atualizar("clima", e.target.value as ParametrosRender["clima"])}
                  className={classeCampo}
                >
                  {OPCOES_CLIMA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {t(opcao.chaveRotulo)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={classeRotulo}>{t("conta.renderizar.campos.prompt")}</span>
              <textarea
                value={parametros.prompt}
                onChange={(e) => atualizar("prompt", e.target.value)}
                rows={3}
                placeholder={t("conta.renderizar.campos.promptMarcador")}
                className={`${classeCampo} resize-none`}
              />
            </label>
          </fieldset>

          <div className="mt-6 border-t border-borda pt-6">
            <Botao tamanho="lg" className="w-full" aoClicar={aoGerar} desabilitado={gerando}>
              {gerando ? t("conta.renderizar.gerando") : t("conta.renderizar.botaoGerar")}
            </Botao>
            {gerando && etapa && (
              <p className="numero-tecnico mt-3 text-center text-xs text-texto-suave">
                {t(`conta.renderizar.etapas.${etapa}`)}
              </p>
            )}
          </div>
        </div>
      </MoldeCantos>
    </motion.div>
  );
}
