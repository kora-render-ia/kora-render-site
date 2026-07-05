import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ptBR from "./idiomas/pt-BR.json";
import en from "./idiomas/en.json";

export const idiomasSuportados = ["pt-BR", "en"] as const;
export type IdiomaSuportado = (typeof idiomasSuportados)[number];

export const idiomaPadrao: IdiomaSuportado = "pt-BR";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": { translation: ptBR },
      en: { translation: en },
    },
    fallbackLng: idiomaPadrao,
    supportedLngs: idiomasSuportados as unknown as string[],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "kora-idioma",
      caches: ["localStorage"],
    },
  });

export default i18n;
