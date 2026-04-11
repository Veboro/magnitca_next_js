import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";
import IndexPage from "@/legacy-pages/Index";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "uk");
}

export default function HomePage() {
  return <IndexPage />;
}
