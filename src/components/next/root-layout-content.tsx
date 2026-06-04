import Script from "next/script";
import { Suspense, type PropsWithChildren } from "react";
import { GoogleAnalytics } from "@/components/next/google-analytics";
import { AppShell } from "@/components/next/app-shell";
import { Providers } from "@/components/next/providers";
import type { SiteLocale } from "@/lib/locale";

export function RootHeadAssets() {
  return (
    <>
      <link rel="preconnect" href="https://xdysdmtwhhnkvdbaaflm.supabase.co" />
      <link rel="preload" as="image" href="/hero-bg.jpg" fetchPriority="high" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8479466204387928"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

export function PublicRootLayoutBody({
  children,
  locale,
}: PropsWithChildren<{ locale: SiteLocale }>) {
  return (
    <body className="official-home official-home-page">
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <Providers initialLocale={locale}>
        <AppShell>{children}</AppShell>
      </Providers>
    </body>
  );
}

export function AdminRootLayoutBody({ children }: PropsWithChildren) {
  return (
    <body className="official-home official-home-page">
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <Providers initialLocale="uk">{children}</Providers>
    </body>
  );
}
