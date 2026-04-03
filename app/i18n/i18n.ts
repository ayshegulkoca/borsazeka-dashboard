import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    defaultNS: "common",
    ns: ["common"],
    load: "languageOnly", // "en-US" → "en", "tr-TR" → "tr"
    preload: ["tr", "en"], // preload both languages upfront
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      // Re-render all components when language changes and resources are loaded
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added",
    },
  });

export default i18n;
