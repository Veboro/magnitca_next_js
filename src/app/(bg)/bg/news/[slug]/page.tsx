import type { Metadata } from "next";
import {
  generateNewsArticleMetadata,
  LocalizedNewsArticlePage,
} from "@/components/next/localized-news-pages";

export const revalidate = 300;

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return generateNewsArticleMetadata({ locale: "bg", slug });
}

export default async function BulgarianNewsArticlePage({ params }: Params) {
  const { slug } = await params;
  return <LocalizedNewsArticlePage locale="bg" slug={slug} />;
}
