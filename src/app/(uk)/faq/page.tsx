import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("faq", "/faq", "uk");
}

export default function FAQPage() {
  return <FAQClient locale="uk" />;
}
