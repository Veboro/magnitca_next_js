"use client";

import { PropsWithChildren, useLayoutEffect } from "react";
import i18n from "@/i18n/config";
import type { SiteLocale } from "@/lib/locale";

export function ForcedLocale({ locale, children }: PropsWithChildren<{ locale: SiteLocale }>) {
  useLayoutEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }

    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}
