import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Inicio from "./paginas/Inicio";

// Carregada sob demanda: mantém o bundle inicial da landing page (rota "/")
// livre do código de autenticação/portal, que só é necessário em /conta.
const Conta = lazy(() => import("./paginas/Conta"));

export default function App() {
  const { i18n } = useTranslation();

  // Mantém o atributo lang do <html> em sincronia com o idioma selecionado
  // (acessibilidade para leitores de tela e sinal correto para buscadores).
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "pt-BR";
  }, [i18n.resolvedLanguage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route
          path="/conta"
          element={
            <Suspense fallback={null}>
              <Conta />
            </Suspense>
          }
        />
        {/* Evita soft-404: qualquer caminho desconhecido volta para a home
            em vez de renderizar uma página em branco (Routes sem match). */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}
