import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("faq", "/faq", "ru");
}

export default function RussianFAQPage() {
  return <FAQClient locale="ru" />;
}
