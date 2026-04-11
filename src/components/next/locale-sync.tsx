"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n/config";
import { isRuPath } from "@/lib/locale";

export function LocaleSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname && isRuPath(pathname) ? "ru" : "uk";

    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
