import "../../index.css";
import { PublicRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { createRootMetadata } from "@/lib/root-layout-metadata";

export const metadata = createRootMetadata("uk");

export default function UkrainianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <PublicRootLayoutBody locale="uk">{children}</PublicRootLayoutBody>
    </html>
  );
}
