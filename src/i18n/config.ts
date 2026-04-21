import i18n, { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import uk from "./locales/uk";
import ru from "./locales/ru";
import pl from "./locales/pl";

function detectLocaleFromPath(pathname?: string) {
  if (!pathname) return "uk";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  return "uk";
}

export const resources = { uk: { translation: uk }, ru: { translation: ru }, pl: { translation: pl } };

export function createI18nInstance(locale: Lang): I18nInstance {
  const instance = createInstance();

  instance.use(initReactI18next);
  void instance.init({
    resources,
    lng: locale,
    fallbackLng: "uk",
    interpolation: { escapeValue: false },
  });

  return instance;
}

i18n.use(initReactI18next);
i18n.init({
  resources,
  lng: typeof window !== "undefined" ? detectLocaleFromPath(window.location.pathname) : "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
});

export default i18n;
export const SUPPORTED_LANGS = ["uk", "ru", "pl"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
