import "../../index.css";
import type { Metadata } from "next";
import { AdminRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Admin | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <AdminRootLayoutBody>{children}</AdminRootLayoutBody>
    </html>
  );
}
