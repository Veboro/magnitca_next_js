import type { Metadata } from "next";
import { generateNewsListMetadata, LocalizedNewsListPage } from "@/components/next/localized-news-pages";

export async function generateMetadata(): Promise<Metadata> {
  return generateNewsListMetadata("bg");
}

export const revalidate = 300;

export default async function BulgarianNewsPage() {
  return <LocalizedNewsListPage locale="bg" />;
}
