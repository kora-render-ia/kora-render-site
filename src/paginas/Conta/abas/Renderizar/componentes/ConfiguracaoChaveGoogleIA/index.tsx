import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import Botao from "../../../../../../componentes/comuns/Botao";
import MoldeCantos from "../../../../../../componentes/ui/MoldeCantos";
import { validarChaveGoogleIA } from "../../../../../../servicos/servicoGoogleIA";
import { salvarChaveGoogleIA } from "../../utilitarios/armazenamentoRenderizar";

const URL_CRIAR_CHAVE = "https://aistudio.google.com/apikey";

interface PropriedadesConfiguracaoChaveGoogleIA {
  aoConfigurada: (chave: string) => void;
}

export default function ConfiguracaoChaveGoogleIA({ aoConfigurada }: PropriedadesConfiguracaoChaveGoogleIA) {
  const { t } = useTranslation();
  const [chave, setChave] = useState("");
  const [testando, setTestando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const inputClasses =
    "w-full rounded-botao border border-borda bg-fundo-elevado px-4 py-2.5 text-sm text-texto-primario placeholder:text-texto-suave focus:border-marca focus:outline-none";

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const valor = chave.trim();
    if (!valor) return;

    setErro(null);
    setTestando(true);
    try {
      const valida = await validarChaveGoogleIA(valor);
      if (!valida) {
        setErro(t("conta.renderizar.chave.chaveInvalida"));
        return;
      }
      salvarChaveGoogleIA(valor);
      aoConfigurada(valor);
    } catch {
      setErro(t("conta.renderizar.erros.erroGenerico"));
    } finally {
      setTestando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-md"
    >
      <MoldeCantos corCanto="marca">
        <form
          onSubmit={aoEnviar}
          className="rounded-quadro border border-borda bg-fundo-elevado p-8 sm:p-10"
        >
          <h2 className="font-titulo text-xl font-bold text-texto-primario">
            {t("conta.renderizar.chave.titulo")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
            {t("conta.renderizar.chave.descricao")}
          </p>

          <a
            href={URL_CRIAR_CHAVE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-marca hover:underline"
          >
            {t("conta.renderizar.chave.linkCriar")}
            <HiOutlineArrowTopRightOnSquare size={13} aria-hidden="true" />
          </a>

          <label className="mt-6 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-texto-secundario">
              {t("conta.renderizar.chave.rotulo")}
            </span>
            <input
              type="password"
              required
              autoComplete="off"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              className={inputClasses}
              placeholder={t("conta.renderizar.chave.marcador")}
            />
          </label>

          {erro && <p className="mt-4 text-sm text-erro">{erro}</p>}

          <Botao type="submit" tamanho="lg" className="mt-6 w-full" desabilitado={testando}>
            {testando ? t("conta.renderizar.chave.testando") : t("conta.renderizar.chave.botaoTestarSalvar")}
          </Botao>
        </form>
      </MoldeCantos>
    </motion.div>
  );
}
