import type { Metadata } from "next";
import { generateNewsListMetadata, LocalizedNewsListPage } from "@/components/next/localized-news-pages";

export async function generateMetadata(): Promise<Metadata> {
  return generateNewsListMetadata("pl");
}

export const revalidate = 300;

export default async function PolishNewsPage() {
  return <LocalizedNewsListPage locale="pl" />;
}
