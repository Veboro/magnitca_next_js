import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { SUPPORTED_LANGS, Lang } from "./config";

export function useLanguage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang: Lang = i18n.language === "ru" ? "ru" : "uk";

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const switchLanguage = (newLang: Lang) => {
    const path = location.pathname;
    let newPath: string;

    if (newLang === "uk") {
      newPath = path.replace(/^\/ru/, "") || "/";
    } else {
      if (path.startsWith("/ru")) {
        newPath = path;
      } else {
        newPath = `/ru${path === "/" ? "" : path}`;
      }
    }

    navigate(newPath + location.search);
  };

  const localePath = (path: string) => {
    if (currentLang === "ru") {
      return `/ru${path === "/" ? "" : path}`;
    }
    return path;
  };

  return { lang: currentLang, switchLanguage, localePath, t: i18n.t.bind(i18n) };
}
