"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n/config";
import { isHuPath, isPlPath, isRoPath, isRuPath } from "@/lib/locale";

export function LocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const docLocale = pathname && isHuPath(pathname) ? "hu" : pathname && isRoPath(pathname) ? "ro" : pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
    const i18nLocale = docLocale;

    if (i18n.language !== i18nLocale) {
      i18n.changeLanguage(i18nLocale);
    }

    document.documentElement.lang = docLocale;
  }, [pathname]);

  return null;
}
