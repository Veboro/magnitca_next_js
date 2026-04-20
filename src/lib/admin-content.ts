import type { Metadata } from "next";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export type PageMetaRecord = {
  page_key: string;
  title: string;
  description: string;
};

export const DEFAULT_PAGE_META: Record<string, PageMetaRecord> = {
  home: {
    page_key: "home",
    title: "Магнітка — магнітні бурі сьогодні, прогноз Kp індексу",
    description:
      "Магнітка — моніторинг магнітних бур в реальному часі. Kp індекс, сонячний вітер, прогноз геомагнітної активності та вплив на здоров'я. Дані NOAA щохвилини.",
  },
  about: {
    page_key: "about",
    title: "Про Магнітку",
    description:
      "Український сервіс моніторингу магнітних бур, Kp-індексу та космічної погоди на основі даних NOAA.",
  },
  contacts: {
    page_key: "contacts",
    title: "Контакти",
    description: "Зв'язок із командою Магнітки: питання, зворотний зв'язок і повідомлення про помилки.",
  },
  cities: {
    page_key: "cities",
    title: "Магнітні бурі по містах України",
    description:
      "Каталог сторінок магнітних бур по містах України з розподілом по областях, обласних центрах і великих населених пунктах.",
  },
  privacy: {
    page_key: "privacy",
    title: "Політика конфіденційності",
    description:
      "Політика конфіденційності сервісу Магнітка: cookie, аналітика та використання зовнішніх джерел даних.",
  },
  cookies: {
    page_key: "cookies",
    title: "Політика cookie",
    description:
      "Політика cookie сервісу Магнітка: які cookie ми використовуємо, для чого вони потрібні та як керувати згодою.",
  },
  terms: {
    page_key: "terms",
    title: "Умови користування",
    description:
      "Умови користування сервісом Магнітка: правила використання сайту, обмеження відповідальності та умови доступу до контенту.",
  },
  faq: {
    page_key: "faq",
    title: "FAQ про магнітні бурі",
    description:
      "Часті питання про магнітні бурі, Kp-індекс, шкалу G1-G5, вплив на самопочуття та техніку.",
  },
  kp_index: {
    page_key: "kp_index",
    title: "Kp індекс",
    description:
      "Поточний Kp-індекс, шкала бурі G1-G5, графік та пояснення впливу геомагнітної активності.",
  },
  solar_wind: {
    page_key: "solar_wind",
    title: "Сонячний вітер",
    description:
      "Швидкість сонячного вітру, густина, IMF Bz та живий графік космічної погоди для відстеження магнітних бур.",
  },
  calendar: {
    page_key: "calendar",
    title: "Календар магнітних бур",
    description:
      "Календар магнітних бур на поточний місяць та найближчий прогноз геомагнітної активності.",
  },
  news: {
    page_key: "news",
    title: "Новини магнітних бур",
    description:
      "Щоденні новини та прогнози магнітних бур, Kp-індексу, сонячного вітру та космічної погоди.",
  },
};

export async function getPageMeta(pageKey: string) {
  const fallback = DEFAULT_PAGE_META[pageKey];

  try {
    const supabase = getSupabaseAdminClient() as any;
    const { data, error } = await supabase
      .from("page_metadata" as never)
      .select("page_key, title, description")
      .eq("page_key", pageKey)
      .maybeSingle();

    if (error || !data) {
      return fallback;
    }

    return {
      page_key: data.page_key,
      title: data.title,
      description: data.description,
    } as PageMetaRecord;
  } catch {
    return fallback;
  }
}

export async function listPageMeta() {
  const supabase = getSupabaseAdminClient() as any;
  const { data, error } = await supabase
    .from("page_metadata" as never)
    .select("page_key, title, description")
    .order("page_key");

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as PageMetaRecord[];
  const byKey = new Map(rows.map((row) => [row.page_key, row]));

  return Object.values(DEFAULT_PAGE_META).map((fallback) => byKey.get(fallback.page_key) ?? fallback);
}

export async function upsertPageMeta(input: PageMetaRecord) {
  const supabase = getSupabaseAdminClient() as any;
  const { error } = await supabase.from("page_metadata").upsert(input, {
    onConflict: "page_key",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listNewsAdmin() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title_uk, slug_uk, title_ru, slug_ru, published_at, source, status")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getNewsAdmin(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createNewsAdmin(input: {
  title_uk: string;
  slug_uk: string | null;
  content_uk: string;
  title_ru: string | null;
  slug_ru: string | null;
  content_ru: string | null;
  image_url: string | null;
  published_at: string;
  status: string;
  meta_title_uk: string | null;
  meta_description_uk: string | null;
  meta_title_ru: string | null;
  meta_description_ru: string | null;
  source: string;
}) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("news")
    .insert({
      ...input,
      title: input.title_uk,
      slug: input.slug_uk,
      content: input.content_uk,
      meta_title: input.meta_title_uk,
      meta_description: input.meta_description_uk,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateNewsAdmin(
  id: string,
  input: {
    title_uk: string;
    slug_uk: string | null;
    content_uk: string;
    title_ru: string | null;
    slug_ru: string | null;
    content_ru: string | null;
    image_url: string | null;
    published_at: string;
    status: string;
    meta_title_uk: string | null;
    meta_description_uk: string | null;
    meta_title_ru: string | null;
    meta_description_ru: string | null;
    source: string;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("news")
    .update({
      ...input,
      title: input.title_uk,
      slug: input.slug_uk,
      content: input.content_uk,
      meta_title: input.meta_title_uk,
      meta_description: input.meta_description_uk,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteNewsAdmin(id: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function resolveMetadata(pageKey: string, canonical: string): Promise<Metadata> {
  const meta = await getPageMeta(pageKey);
  return {
    title: meta?.title,
    description: meta?.description,
    alternates: {
      canonical,
    },
  };
}
