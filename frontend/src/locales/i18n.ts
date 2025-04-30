import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { CONFIG } from "src/global-config";
import { LANGUAGE } from "src/consts/language";

i18n
  .use(HttpApi) // Load translations from the public folder
  .use(initReactI18next) // Bind with React
  .init({
    fallbackLng: LANGUAGE.PL, // Default language
    supportedLngs: Object.values(LANGUAGE), // Available languages
    lng: LANGUAGE.PL, // Default language
    debug: CONFIG.isLocal, // Debug in dev mode
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ["cookies"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    },
  });

export default i18n;
