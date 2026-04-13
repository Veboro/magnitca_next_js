import type { Metadata } from "next";
import "../index.css";
import { PublicFooter } from "@/components/next/public-footer";
import { GoogleAnalytics } from "@/components/next/google-analytics";
import { PublicHeader } from "@/components/next/public-header";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className="dark">
      <body>
        <GoogleAnalytics />
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <PublicHeader />
            {children}
            <PublicFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
