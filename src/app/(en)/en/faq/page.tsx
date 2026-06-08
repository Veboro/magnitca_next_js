import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("faq", "/faq", "en");
}

export default function EnglishFAQPage() {
  return <FAQClient locale="en" />;
}
