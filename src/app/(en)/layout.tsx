import "../../index.css";
import { PublicRootLayoutBody, RootHeadAssets } from "@/components/next/root-layout-content";
import { createRootMetadata } from "@/lib/root-layout-metadata";

export const metadata = createRootMetadata("en");

export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="official-home-page">
      <head>
        <RootHeadAssets />
      </head>
      <PublicRootLayoutBody locale="en">{children}</PublicRootLayoutBody>
    </html>
  );
}
