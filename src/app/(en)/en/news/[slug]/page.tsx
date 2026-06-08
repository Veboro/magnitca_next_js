import type { Metadata } from "next";
import { generateNewsArticleMetadata, LocalizedNewsArticlePage } from "@/components/next/localized-news-pages";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return generateNewsArticleMetadata({ locale: "en", slug });
}

export const revalidate = 300;

export default async function EnglishNewsArticlePage({ params }: Params) {
  const { slug } = await params;
  return <LocalizedNewsArticlePage locale="en" slug={slug} />;
}
