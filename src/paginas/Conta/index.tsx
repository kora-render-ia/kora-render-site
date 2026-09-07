import { useEffect, useState, lazy, Suspense, type FormEvent } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
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
import NavegacaoConta from "./componentes/NavegacaoConta";
import AbaDownloads from "./abas/Downloads";
import AbaVideos from "./abas/Videos";
import type { RespostaPortal } from "../../tipos";

// O visualizador 360 carrega o Pannellum (biblioteca de terceiros); mantê-lo
// como um chunk separado evita que esse peso extra afete quem só usa
// Downloads ou Vídeos.
const AbaPanorama360 = lazy(() => import("./abas/Panorama360"));

// Prompts extensos (vários KB de texto) só baixados por quem realmente abre
// a aba de renderização.
const AbaRenderizar = lazy(() => import("./abas/Renderizar"));

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

function PainelAutenticado({ sessao, aoSair }: { sessao: RespostaPortal; aoSair: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-1 flex-col lg:flex-row">
      <NavegacaoConta license={sessao.license} aoSair={aoSair} />
      <div className="min-w-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-texto-secundario">{t("conta.painel.carregando")}</p>
            </div>
          }
        >
          <Routes>
            <Route index element={<AbaDownloads sessao={sessao} />} />
            <Route path="videos" element={<AbaVideos />} />
            <Route path="360" element={<AbaPanorama360 />} />
            <Route path="renderizar" element={<AbaRenderizar />} />
            <Route path="*" element={<Navigate to="/conta" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
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

      <main className="relative flex flex-1 flex-col">
        {verificando ? (
          <div className="flex flex-1 items-center justify-center px-6 py-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-texto-secundario"
            >
              {t("conta.painel.carregando")}
            </motion.p>
          </div>
        ) : sessao ? (
          <PainelAutenticado sessao={sessao} aoSair={aoSair} />
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 py-16">
            <FormularioLogin aoLogar={definirSessao} />
          </div>
        )}
      </main>

      {!sessao && !verificando && (
        <Contentor className="pb-8 text-center">
          <Link to="/" className="text-xs text-texto-secundario hover:text-marca">
            {t("conta.voltar")}
          </Link>
        </Contentor>
      )}
    </div>
  );
}
