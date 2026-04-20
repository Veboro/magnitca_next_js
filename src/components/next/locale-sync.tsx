"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n/config";
import { isPlPath, isRuPath } from "@/lib/locale";

export function LocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const docLocale = pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
    const i18nLocale = docLocale;

    if (i18n.language !== i18nLocale) {
      i18n.changeLanguage(i18nLocale);
    }

    document.documentElement.lang = docLocale;
  }, [pathname]);

  return null;
}
