import "../../index.css";
import { PublicRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { createRootMetadata } from "@/lib/root-layout-metadata";

export const metadata = createRootMetadata("hu");

export default function HungarianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <PublicRootLayoutBody locale="hu">{children}</PublicRootLayoutBody>
    </html>
  );
}
