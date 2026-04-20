import type { Metadata } from "next";
import { headers } from "next/headers";
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
  const headerStore = await headers();
  const locale = headerStore.get("x-site-locale") === "ru"
    ? "ru"
    : headerStore.get("x-site-locale") === "pl"
      ? "pl"
      : "uk";

  return (
    <html lang={locale} className="dark">
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
