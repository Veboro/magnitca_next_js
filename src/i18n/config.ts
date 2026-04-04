import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uk from "./locales/uk";
import ru from "./locales/ru";

i18n.use(initReactI18next).init({
  resources: { uk: { translation: uk }, ru: { translation: ru } },
  lng: "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
});

export default i18n;
export const SUPPORTED_LANGS = ["uk", "ru"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
