import type { Metadata } from "next";
import { Suspense } from "react";
import "../index.css";
import { GoogleAnalytics } from "@/components/next/google-analytics";
import { Providers } from "@/components/next/providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Магнітка — магнітні бурі сьогодні, прогноз Kp індексу",
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
    title: "Магнітка — магнітні бурі сьогодні, прогноз Kp індексу",
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
    title: "Магнітка — магнітні бурі сьогодні, прогноз Kp індексу",
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
