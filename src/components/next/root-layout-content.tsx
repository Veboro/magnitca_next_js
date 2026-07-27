import Script from "next/script";
import { Suspense, type PropsWithChildren } from "react";
import { GoogleAnalytics } from "@/components/next/google-analytics";
import { AppShell } from "@/components/next/app-shell";
import { Providers } from "@/components/next/providers";
import { ScrollToTop } from "@/components/next/scroll-to-top";
import type { SiteLocale } from "@/lib/locale";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILE_URLS,
  absoluteUrl,
} from "@/lib/site";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/pwa-icon-512.png"),
        width: 512,
        height: 512,
      },
      sameAs: SOCIAL_PROFILE_URLS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export function RootHeadAssets() {
  return (
    <>
      <link rel="preconnect" href="https://xdysdmtwhhnkvdbaaflm.supabase.co" />
      <link rel="preload" as="image" href="/hero-bg.jpg" fetchPriority="high" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_STRUCTURED_DATA) }}
      />
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
      <ScrollToTop />
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
