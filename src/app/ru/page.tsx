import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "ru");
}

export default function RussianHomePage() {
  return <IndexPage />;
}
