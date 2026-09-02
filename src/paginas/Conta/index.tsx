import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Contentor from "../../componentes/comuns/Contentor";
import Botao from "../../componentes/comuns/Botao";
import MoldeCantos from "../../componentes/ui/MoldeCantos";
import FundoTecnico from "../../componentes/ui/FundoTecnico";
import { NOME_SITE } from "../../constantes";
import logoLumi from "../../ativos/logo/lumi-completa.png";
import { servicoPortal, obterTokenSalvo, limparTokenSalvo } from "../../servicos/servicoPortal";
import { useMetadadosPagina } from "../../ganchos/useMetadadosPagina";
import type { RespostaPortal, StatusLicencaPortal } from "../../tipos";

const CORES_STATUS: Record<StatusLicencaPortal, string> = {
  ACTIVE: "border-sucesso/30 bg-sucesso/10 text-sucesso",
  BLOCKED: "border-erro/30 bg-erro/10 text-erro",
  EXPIRED: "border-aviso/30 bg-aviso/10 text-aviso",
  REFUNDED: "border-erro/30 bg-erro/10 text-erro",
  CANCELED: "border-texto-suave/30 bg-superficie text-texto-secundario",
};

function formatarData(iso: string, idioma: string): string {
  return new Date(iso).toLocaleDateString(idioma === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function CabecalhoConta() {
  return (
    <Contentor className="flex h-20 items-center justify-between">
      <Link to="/" className="flex items-center">
        <img
          src={logoLumi}
          alt={NOME_SITE}
          width={500}
          height={150}
          className="h-8 w-auto object-contain"
        />
      </Link>
    </Contentor>
  );
}

function FormularioLogin({ aoLogar }: { aoLogar: (r: RespostaPortal) => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [chave, setChave] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [telaEsqueci, setTelaEsqueci] = useState(false);

  const inputClasses =
    "w-full rounded-botao border border-borda bg-fundo-elevado px-4 py-2.5 text-sm text-texto-primario placeholder:text-texto-suave focus:border-marca focus:outline-none";

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await servicoPortal.login(email, chave.trim().toUpperCase());
      aoLogar(resultado);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  if (telaEsqueci) {
    return <FormularioEsqueciChave aoVoltar={() => setTelaEsqueci(false)} />;
  }

  return (
    <MoldeCantos corCanto="marca" className="w-full max-w-md">
      <form
        onSubmit={aoEnviar}
        className="rounded-quadro border border-borda bg-fundo-elevado p-8 sm:p-10"
      >
        <h1 className="font-titulo text-2xl font-bold text-texto-primario">
          {t("conta.login.titulo")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
          {t("conta.login.descricao")}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-texto-secundario">
              {t("conta.login.rotuloEmail")}
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="voce@email.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-texto-secundario">
              {t("conta.login.rotuloChave")}
            </span>
            <input
              type="text"
              required
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              className={mesclarUpper(inputClasses)}
              placeholder={t("conta.login.marcadorChave")}
              pattern="^[Kk][Rr]-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$"
            />
          </label>
        </div>

        {erro && <p className="mt-4 text-sm text-erro">{erro}</p>}

        <Botao type="submit" tamanho="lg" className="mt-6 w-full" desabilitado={carregando}>
          {carregando ? t("conta.login.botaoEntrando") : t("conta.login.botaoEntrar")}
        </Botao>

        <button
          type="button"
          onClick={() => setTelaEsqueci(true)}
          className="mt-4 w-full text-center text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline"
        >
          {t("conta.login.esqueciChave")}
        </button>
      </form>
    </MoldeCantos>
  );
}

function mesclarUpper(base: string): string {
  return `${base} numero-tecnico uppercase placeholder:normal-case`;
}

function FormularioEsqueciChave({ aoVoltar }: { aoVoltar: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await servicoPortal.esqueciLicenca(email);
      setEnviado(true);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <MoldeCantos corCanto="marca" className="w-full max-w-md">
      <div className="rounded-quadro border border-borda bg-fundo-elevado p-8 sm:p-10">
        <h1 className="font-titulo text-2xl font-bold text-texto-primario">
          {t("conta.login.esqueciTitulo")}
        </h1>

        {enviado ? (
          <p className="mt-4 text-sm leading-relaxed text-texto-secundario">
            {t("conta.login.esqueciSucesso")}
          </p>
        ) : (
          <form onSubmit={aoEnviar}>
            <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
              {t("conta.login.esqueciDescricao")}
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-6 w-full rounded-botao border border-borda bg-fundo-elevado px-4 py-2.5 text-sm text-texto-primario placeholder:text-texto-suave focus:border-marca focus:outline-none"
              placeholder="voce@email.com"
            />
            {erro && <p className="mt-3 text-sm text-erro">{erro}</p>}
            <Botao type="submit" tamanho="lg" className="mt-6 w-full" desabilitado={carregando}>
              {carregando ? t("conta.login.esqueciEnviando") : t("conta.login.esqueciBotao")}
            </Botao>
          </form>
        )}

        <button
          type="button"
          onClick={aoVoltar}
          className="mt-4 w-full text-center text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline"
        >
          {t("conta.login.esqueciVoltar")}
        </button>
      </div>
    </MoldeCantos>
  );
}

function PainelConta({ sessao, aoSair }: { sessao: RespostaPortal; aoSair: () => void }) {
  const { t, i18n } = useTranslation();
  const { license, plugin } = sessao;
  const [agora] = useState(() => Date.now());
  const naoExpirada = new Date(license.expires_at).getTime() > agora;
  const podeBaixar = license.status === "ACTIVE" && naoExpirada && !!plugin.download_url;

  return (
    <MoldeCantos corCanto="marca" className="w-full max-w-lg">
      <div className="rounded-quadro border border-borda bg-fundo-elevado p-8 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-titulo text-2xl font-bold text-texto-primario">
            {t("conta.painel.saudacao", { nome: license.name })}
          </h1>
          <span
            className={`inline-flex shrink-0 items-center rounded-selo border px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${CORES_STATUS[license.status]}`}
          >
            {t(`conta.status.${license.status}`)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-borda pt-6 text-sm">
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

        <button
          type="button"
          onClick={aoSair}
          className="mt-6 w-full text-center text-xs text-texto-secundario underline-offset-2 hover:text-marca hover:underline"
        >
          {t("conta.painel.sair")}
        </button>
      </div>
    </MoldeCantos>
  );
}

export default function Conta() {
  const { t } = useTranslation();

  useMetadadosPagina({
    titulo: t("conta.tituloPagina"),
    descricao: t("conta.descricaoPagina"),
    caminho: "/conta",
    semIndexacao: true,
  });

  const [sessao, definirSessao] = useState<RespostaPortal | null>(null);
  const [verificando, definirVerificando] = useState(true);

  useEffect(() => {
    (async () => {
      if (!obterTokenSalvo()) {
        definirVerificando(false);
        return;
      }
      try {
        definirSessao(await servicoPortal.me());
      } catch {
        limparTokenSalvo();
      } finally {
        definirVerificando(false);
      }
    })();
  }, []);

  const aoSair = () => {
    servicoPortal.logout();
    definirSessao(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <FundoTecnico comBrilho className="fixed" />
      <CabecalhoConta />

      <main className="relative flex flex-1 items-center justify-center px-6 py-16">
        {verificando ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-texto-secundario"
          >
            {t("conta.painel.carregando")}
          </motion.p>
        ) : sessao ? (
          <PainelConta sessao={sessao} aoSair={aoSair} />
        ) : (
          <FormularioLogin aoLogar={definirSessao} />
        )}
      </main>

      <Contentor className="pb-8 text-center">
        <Link to="/" className="text-xs text-texto-secundario hover:text-marca">
          {t("conta.voltar")}
        </Link>
      </Contentor>
    </div>
  );
}
