import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { CONFIG } from "src/global-config";

i18n
  .use(HttpApi) // Load translations from the public folder
  .use(initReactI18next) // Bind with React
  .init({
    fallbackLng: "en", // Default language
    supportedLngs: ["en", "pl"], // Available languages
    lng: "en", // Default language
    debug: CONFIG.isLocal, // Debug in dev mode
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    defaultNS: "home", // Default namespace
    ns: ["home", "navigation"], // Namespaces
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    },
  });

export default i18n;
