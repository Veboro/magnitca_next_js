"use client";

import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useLayoutEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { createI18nInstance } from "@/i18n/config";
import { AppShell } from "@/components/next/app-shell";
import { isPlPath, isRuPath, type SiteLocale } from "@/lib/locale";

export function Providers({
  children,
  initialLocale,
}: PropsWithChildren<{ initialLocale: SiteLocale }>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const currentLocale: SiteLocale = pathname && isPlPath(pathname)
    ? "pl"
    : pathname && isRuPath(pathname)
      ? "ru"
      : "uk";
  const i18n = useMemo(() => createI18nInstance(currentLocale), [currentLocale]);

  useLayoutEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  return (
    <I18nextProvider i18n={i18n} defaultNS="translation" key={currentLocale}>
      <QueryClientProvider client={queryClient}>
        <AppShell>{children}</AppShell>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
