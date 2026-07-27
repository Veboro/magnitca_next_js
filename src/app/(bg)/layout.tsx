import "../../index.css";
import { PublicRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { createRootMetadata } from "@/lib/root-layout-metadata";

export const metadata = createRootMetadata("bg");

export default function BulgarianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <PublicRootLayoutBody locale="bg">{children}</PublicRootLayoutBody>
    </html>
  );
}
