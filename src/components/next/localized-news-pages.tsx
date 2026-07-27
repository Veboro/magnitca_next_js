import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { SiteLocale } from "@/lib/locale";
import { getPathForLocale } from "@/lib/locale";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { absoluteUrl, SOCIAL_PROFILE_URLS } from "@/lib/site";
import { getLatestNews, getNewsArticleBySlug, getNewsArticleFallbackTargetBySlug } from "@/lib/server-news";

const NEWS_COPY: Record<
  SiteLocale,
  {
    dateLocale: string;
    heading: string;
    description: string;
    empty: string;
    notFound: string;
    publisher: string;
  }
> = {
  uk: {
    dateLocale: "uk-UA",
    heading: "Новини магнітних бур",
    description:
      "Щоденні матеріали про магнітні бурі, геомагнітну активність, прогнози NOAA та вплив космічної погоди на самопочуття.",
    empty: "Новини поки не завантажені.",
    notFound: "Новину не знайдено",
    publisher: "Магнітка",
  },
  ru: {
    dateLocale: "ru-RU",
    heading: "Новости магнитных бурь",
    description:
      "Ежедневные материалы о магнитных бурях, геомагнитной активности, прогнозах NOAA и влиянии космической погоды на самочувствие.",
    empty: "Новости пока не загружены.",
    notFound: "Новость не найдена",
    publisher: "Магнитка",
  },
  pl: {
    dateLocale: "pl-PL",
    heading: "Wiadomości o burzach magnetycznych",
    description:
      "Codzienne materiały o burzach magnetycznych, aktywności geomagnetycznej, prognozach NOAA i wpływie pogody kosmicznej na samopoczucie.",
    empty: "Wiadomości nie zostały jeszcze dodane.",
    notFound: "Nie znaleziono wiadomości",
    publisher: "Magnitca",
  },
  ro: {
    dateLocale: "ro-RO",
    heading: "Știri despre furtuni magnetice",
    description:
      "Materiale zilnice despre furtuni magnetice, activitate geomagnetică, prognoze NOAA și influența vremii spațiale asupra stării de bine.",
    empty: "Știrile nu au fost încă adăugate.",
    notFound: "Știrea nu a fost găsită",
    publisher: "Magnitca",
  },
  hu: {
    dateLocale: "hu-HU",
    heading: "Mágneses vihar hírek",
    description:
      "Napi anyagok mágneses viharokról, geomágneses aktivitásról, NOAA-előrejelzésekről és az űridőjárás közérzetre gyakorolt hatásáról.",
    empty: "Még nincsenek hírek feltöltve.",
    notFound: "A hír nem található",
    publisher: "Magnitca",
  },
  bg: {
    dateLocale: "bg-BG",
    heading: "Новини за магнитните бури",
    description:
      "Ежедневни материали за магнитните бури, геомагнитната активност, прогнозите на NOAA и влиянието на космическото време върху самочувствието.",
    empty: "Новините още не са добавени.",
    notFound: "Новината не е намерена",
    publisher: "Magnitca",
  },
  en: {
    dateLocale: "en-US",
    heading: "Magnetic storm news",
    description:
      "Daily articles about magnetic storms, geomagnetic activity, NOAA forecasts and how space weather may affect wellbeing.",
    empty: "No news has been added yet.",
    notFound: "News article not found",
    publisher: "Magnitca",
  },
};

function getNewsPath(locale: SiteLocale, slug?: string | null) {
  const basePath = getPathForLocale("/news", locale);
  return slug ? `${basePath}/${slug}` : basePath;
}

function getArticleLanguages(alternateSlugs: Partial<Record<SiteLocale, string>>) {
  const languages: Record<string, string> = {};

  (Object.entries(alternateSlugs) as Array<[SiteLocale, string]>).forEach(([locale, slug]) => {
    languages[locale] = getNewsPath(locale, slug);
  });

  if (alternateSlugs.uk) {
    languages["x-default"] = getNewsPath("uk", alternateSlugs.uk);
  }

  return languages;
}

export function generateNewsListMetadata(locale: SiteLocale): Promise<Metadata> {
  return resolveLocalizedMetadata("news", "/news", locale);
}

export async function LocalizedNewsListPage({ locale }: { locale: SiteLocale }) {
  const copy = NEWS_COPY[locale];
  const news = await getLatestNews(30, locale).catch(() => []);

  return (
    <main className="official-page-main">
      <div className="official-page-shell">
        <div className="official-page-header">
          <h1 className="font-display text-4xl font-bold">{copy.heading}</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{copy.description}</p>
        </div>

        <div className="mt-8 divide-y divide-border/40 rounded-3xl border border-border/50 bg-card shadow-sm">
          {news.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground">{copy.empty}</div>
          ) : (
            news.map((item) => (
              <Link
                key={item.id}
                href={getNewsPath(locale, item.slug || item.id)}
                className="block p-6 transition hover:bg-muted/20"
              >
                <h2 className="text-lg font-semibold leading-7 text-foreground">{item.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {new Date(item.published_at).toLocaleDateString(copy.dateLocale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {item.description ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export async function generateNewsArticleMetadata({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}): Promise<Metadata> {
  const copy = NEWS_COPY[locale];
  const article = await getNewsArticleBySlug(slug, locale).catch(() => null);

  if (!article) {
    return {
      title: copy.notFound,
    };
  }

  const description =
    article.meta_description ||
    article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const canonical = getNewsPath(locale, article.slug || article.id);

  return {
    title: article.meta_title || article.title,
    description,
    alternates: {
      canonical,
      languages: getArticleLanguages(article.alternateSlugs),
    },
    openGraph: {
      type: "article",
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

export async function LocalizedNewsArticlePage({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}) {
  const copy = NEWS_COPY[locale];
  const article = await getNewsArticleBySlug(slug, locale).catch(() => null);

  if (!article) {
    const fallbackTarget = await getNewsArticleFallbackTargetBySlug(slug, locale).catch(() => null);
    if (fallbackTarget) {
      permanentRedirect(getNewsPath(fallbackTarget.locale, fallbackTarget.slug));
    }

    notFound();
  }

  if (article.slug && article.slug !== slug) {
    permanentRedirect(getNewsPath(locale, article.slug));
  }

  const canonicalPath = getNewsPath(locale, article.slug || article.id);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const description =
    article.meta_description ||
    article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

  const organization = {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: copy.publisher,
    url: absoluteUrl(getPathForLocale("/", locale)),
    sameAs: SOCIAL_PROFILE_URLS,
  };

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
    author: organization,
    publisher: {
      ...organization,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/pwa-icon-512.png"),
        width: 512,
        height: 512,
      },
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
    <main className="official-page-main">
      <div className="official-page-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mb-6">
          <MobileAdsenseSlot />
        </div>
        <article className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
          {article.image_url ? (
            <div className="relative aspect-[2/1] w-full">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {new Date(article.published_at).toLocaleDateString(copy.dateLocale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              {article.title}
            </h1>
            <div className="news-article-body official-page-prose prose prose-sm max-w-none">
              {article.content.includes("<") && article.content.includes(">") ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <div className="whitespace-pre-line text-base leading-8">{article.content}</div>
              )}
            </div>
            <div className="mt-6">
              <MobileAdsenseSlot />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
