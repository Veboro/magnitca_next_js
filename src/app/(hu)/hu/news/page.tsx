import type { Metadata } from "next";
import { generateNewsListMetadata, LocalizedNewsListPage } from "@/components/next/localized-news-pages";

export async function generateMetadata(): Promise<Metadata> {
  return generateNewsListMetadata("hu");
}

export const revalidate = 300;

export default async function HungarianNewsPage() {
  return <LocalizedNewsListPage locale="hu" />;
}
