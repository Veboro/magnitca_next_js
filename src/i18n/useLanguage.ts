import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { SUPPORTED_LANGS, Lang } from "./config";

export function useLanguage() {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang: Lang = lang === "ru" ? "ru" : "uk";

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
    document.documentElement.lang = currentLang;
  }, [currentLang, i18n]);

  const switchLanguage = (newLang: Lang) => {
    const path = location.pathname;
    let newPath: string;

    if (newLang === "uk") {
      // Remove /ru prefix
      newPath = path.replace(/^\/ru/, "") || "/";
    } else {
      // Add /ru prefix
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
