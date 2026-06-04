import "../../index.css";
import { PublicRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { createRootMetadata } from "@/lib/root-layout-metadata";

export const metadata = createRootMetadata("ro");

export default function RomanianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <PublicRootLayoutBody locale="ro">{children}</PublicRootLayoutBody>
    </html>
  );
}
