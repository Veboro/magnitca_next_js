import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "../index.css";
import { GoogleAnalytics } from "@/components/next/google-analytics";
import { Providers } from "@/components/next/providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Магнітні бурі сьогодні — Kp-індекс, сонячний вітер і прогноз | Магнітка",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Магнітні бурі сьогодні — Kp-індекс, сонячний вітер і прогноз | Магнітка",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Магнітні бурі сьогодні — Kp-індекс, сонячний вітер і прогноз | Магнітка",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className="dark">
      <head>
        <link rel="preconnect" href="https://xdysdmtwhhnkvdbaaflm.supabase.co" />
        <link rel="preload" as="image" href="/hero-bg.jpg" fetchPriority="high" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8479466204387928"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Providers initialLocale="uk">{children}</Providers>
      </body>
    </html>
  );
}
