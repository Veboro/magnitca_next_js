import type { Metadata } from "next";
import { generateNewsListMetadata, LocalizedNewsListPage } from "@/components/next/localized-news-pages";

export async function generateMetadata(): Promise<Metadata> {
  return generateNewsListMetadata("ru");
}

export const revalidate = 300;

export default async function RussianNewsPage() {
  return <LocalizedNewsListPage locale="ru" />;
}
