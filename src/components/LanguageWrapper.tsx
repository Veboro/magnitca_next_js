import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Lang } from "@/i18n/config";

export const LanguageWrapper = () => {
  const { "*": rest } = useParams();
  const { i18n } = useTranslation();
  const path = window.location.pathname;
  const isRu = path.startsWith("/ru");
  const lang: Lang = isRu ? "ru" : "uk";

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return <Outlet />;
};
