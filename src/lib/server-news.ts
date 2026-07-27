import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { SiteLocale } from "@/lib/locale";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-env";

export type NewsArticle = Database["public"]["Tables"]["news"]["Row"];
export type LocalizedNewsListItem = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  published_at: string;
  image_url: string | null;
};
export type LocalizedNewsArticle = {
  id: string;
  slug: string | null;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  image_url: string | null;
  published_at: string;
  updated_at: string;
  alternateSlug: string | null;
  alternateSlugs: Partial<Record<SiteLocale, string>>;
};

const NEWS_LOCALES: SiteLocale[] = ["uk", "ru", "pl", "ro", "hu", "bg", "en"];

function getNewsField<T extends NewsArticle, K extends "title" | "slug" | "content" | "meta_title" | "meta_description">(
  item: T,
  field: K,
  locale: SiteLocale,
) {
  return item[`${field}_${locale}` as keyof T] as T[keyof T] | null;
}

function getAlternateSlug(item: NewsArticle, locale: SiteLocale) {
  const fallbackLocale = locale === "uk" ? "ru" : "uk";
  return getNewsField(item, "slug", fallbackLocale) as string | null;
}

function getAlternateSlugs(item: NewsArticle) {
  return NEWS_LOCALES.reduce<Partial<Record<SiteLocale, string>>>((slugs, locale) => {
    const slug = getNewsField(item, "slug", locale) as string | null;
    const title = getNewsField(item, "title", locale) as string | null;
    const content = getNewsField(item, "content", locale) as string | null;

    if (slug && title && content) {
      slugs[locale] = slug;
    }

    return slugs;
  }, {});
}

function getSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase env vars are not configured for server-side content fetching.");
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getLatestNews(limit = 30, locale: SiteLocale = "uk"): Promise<LocalizedNewsListItem[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select(
      "id, published_at, image_url, status, title_uk, slug_uk, meta_description_uk, title_ru, slug_ru, meta_description_ru, title_pl, slug_pl, meta_description_pl, title_ro, slug_ro, meta_description_ro, title_hu, slug_hu, meta_description_hu"
        + ", title_bg, slug_bg, meta_description_bg, title_en, slug_en, meta_description_en"
    )
    .eq("status", "published")
    .neq("source", "telegram_ai")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((item) => {
      const newsItem = item as unknown as NewsArticle;
      const title = getNewsField(newsItem, "title", locale) as string | null;
      const slug = getNewsField(newsItem, "slug", locale) as string | null;
      const description = getNewsField(newsItem, "meta_description", locale) as string | null;

      if (!title || !slug) return null;

      return {
        id: newsItem.id,
        slug,
        title,
        description: description ?? null,
        published_at: newsItem.published_at,
        image_url: newsItem.image_url,
      };
    })
    .filter((item): item is LocalizedNewsListItem => Boolean(item));
}

export async function getNewsArticleBySlug(
  slug: string,
  locale: SiteLocale = "uk"
): Promise<LocalizedNewsArticle | null> {
  const supabase = getSupabaseServerClient();
  const slugColumn = NEWS_LOCALES.includes(locale) ? `slug_${locale}` : "slug_uk";

  let { data, error } = await supabase
    .from("news")
    .select("*")
      .eq(slugColumn as "slug_uk", slug)
    .eq("status", "published")
    .neq("source", "telegram_ai")
    .maybeSingle();

  if (!data) {
    ({ data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", slug)
      .eq("status", "published")
      .neq("source", "telegram_ai")
      .maybeSingle());
  }

  if (!data) {
    ({ data, error } = await supabase
      .from("news")
      .select("*")
      .or(NEWS_LOCALES.map((itemLocale) => `slug_${itemLocale}.eq.${slug}`).join(","))
      .eq("status", "published")
      .neq("source", "telegram_ai")
      .maybeSingle());
  }

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const title = getNewsField(data, "title", locale) as string | null;
  const localizedSlug = getNewsField(data, "slug", locale) as string | null;
  const content = getNewsField(data, "content", locale) as string | null;
  const metaTitle = getNewsField(data, "meta_title", locale) as string | null;
  const metaDescription = getNewsField(data, "meta_description", locale) as string | null;
  const alternateSlug = getAlternateSlug(data, locale);
  const alternateSlugs = getAlternateSlugs(data);

  if (!title || !localizedSlug || !content) return null;

  return {
    id: data.id,
    slug: localizedSlug,
    title,
    content,
    meta_title: metaTitle ?? null,
    meta_description: metaDescription ?? null,
    image_url: data.image_url,
    published_at: data.published_at,
    updated_at: data.updated_at,
    alternateSlug: alternateSlug ?? null,
    alternateSlugs,
  };
}

export async function getNewsArticleFallbackTargetBySlug(
  slug: string,
  preferredLocale: SiteLocale = "uk",
): Promise<{ locale: SiteLocale; slug: string } | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select(
      "slug_uk, title_uk, content_uk, slug_ru, title_ru, content_ru, slug_pl, title_pl, content_pl, slug_ro, title_ro, content_ro, slug_hu, title_hu, content_hu, slug_bg, title_bg, content_bg, slug_en, title_en, content_en",
    )
    .or(NEWS_LOCALES.map((itemLocale) => `slug_${itemLocale}.eq.${slug}`).join(","))
    .eq("status", "published")
    .neq("source", "telegram_ai")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const locales = [preferredLocale, "uk", "ru", "en", "pl", "ro", "hu", "bg"] satisfies SiteLocale[];
  for (const itemLocale of locales) {
    const localizedSlug = getNewsField(data as NewsArticle, "slug", itemLocale) as string | null;
    const title = getNewsField(data as NewsArticle, "title", itemLocale) as string | null;
    const content = getNewsField(data as NewsArticle, "content", itemLocale) as string | null;

    if (localizedSlug && title && content) {
      return { locale: itemLocale, slug: localizedSlug };
    }
  }

  return null;
}
