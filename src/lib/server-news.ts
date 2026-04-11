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
};

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
      "id, published_at, image_url, status, title_uk, slug_uk, meta_description_uk, title_ru, slug_ru, meta_description_ru"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((item) => {
      const title = locale === "ru" ? item.title_ru : item.title_uk;
      const slug = locale === "ru" ? item.slug_ru : item.slug_uk;
      const description = locale === "ru" ? item.meta_description_ru : item.meta_description_uk;

      if (!title || !slug) return null;

      return {
        id: item.id,
        slug,
        title,
        description: description ?? null,
        published_at: item.published_at,
        image_url: item.image_url,
      };
    })
    .filter((item): item is LocalizedNewsListItem => Boolean(item));
}

export async function getNewsArticleBySlug(
  slug: string,
  locale: SiteLocale = "uk"
): Promise<LocalizedNewsArticle | null> {
  const supabase = getSupabaseServerClient();
  const slugColumn = locale === "ru" ? "slug_ru" : "slug_uk";

  let { data, error } = await supabase
    .from("news")
    .select("*")
    .eq(slugColumn, slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    ({ data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", slug)
      .eq("status", "published")
      .maybeSingle());
  }

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const title = locale === "ru" ? data.title_ru : data.title_uk;
  const localizedSlug = locale === "ru" ? data.slug_ru : data.slug_uk;
  const content = locale === "ru" ? data.content_ru : data.content_uk;
  const metaTitle = locale === "ru" ? data.meta_title_ru : data.meta_title_uk;
  const metaDescription = locale === "ru" ? data.meta_description_ru : data.meta_description_uk;
  const alternateSlug = locale === "ru" ? data.slug_uk : data.slug_ru;

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
  };
}
