import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsArticleBySlug } from "@/lib/server-news";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug, "ru").catch(() => null);

  if (!article) {
    return {
      title: "Новость не найдена",
    };
  }

  const description =
    article.meta_description ||
    article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const canonical = `/ru/news/${article.slug || article.id}`;

  return {
    title: article.meta_title || article.title,
    description,
    alternates: {
      canonical,
      languages: article.alternateSlug
        ? {
            uk: `/news/${article.alternateSlug}`,
            ru: canonical,
            "x-default": `/news/${article.alternateSlug}`,
          }
        : {
            ru: canonical,
            "x-default": "/news",
          },
    },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      title: article.meta_title || article.title,
      description,
      url: canonical,
      images: article.image_url ? [{ url: article.image_url }] : undefined,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta_title || article.title,
      description,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

export default async function RussianNewsArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug, "ru").catch(() => null);

  if (!article) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/ru/news/${article.slug || article.id}`);
  const description =
    article.meta_description ||
    article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Магнитка",
      url: absoluteUrl("/ru"),
    },
    ...(article.image_url
      ? {
          image: {
            "@type": "ImageObject",
            url: article.image_url,
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} className="aspect-[2/1] w-full object-cover" />
        ) : null}
        <div className="p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {new Date(article.published_at).toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{article.title}</h1>
          <div className="mt-6 prose prose-sm max-w-none text-foreground dark:prose-invert">
            {article.content.includes("<") && article.content.includes(">") ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="whitespace-pre-line text-base leading-8">{article.content}</div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
