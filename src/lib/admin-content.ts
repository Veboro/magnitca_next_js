import type { Metadata } from "next";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export type PageMetaRecord = {
  page_key: string;
  title: string;
  description: string;
};

type PageMetaQueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

type PageMetaQueryBuilder<T> = {
  select(columns: string): PageMetaQueryBuilder<T>;
  eq(column: string, value: string): PageMetaQueryBuilder<T>;
  order(column: string): Promise<PageMetaQueryResult<T[]>>;
  maybeSingle(): Promise<PageMetaQueryResult<T>>;
};

type PageMetaSupabaseClient = {
  from(table: "page_metadata"): PageMetaQueryBuilder<PageMetaRecord> & {
    upsert(input: PageMetaRecord, options: { onConflict: string }): Promise<PageMetaQueryResult<null>>;
  };
};

function getPageMetaClient() {
  return getSupabaseAdminClient() as unknown as PageMetaSupabaseClient;
}

export const DEFAULT_PAGE_META: Record<string, PageMetaRecord> = {
  home: {
    page_key: "home",
    title: "Магнітні бурі сьогодні — Kp-індекс, сонячний вітер і прогноз | Магнітка",
    description:
      "Магнітка — моніторинг магнітних бур в реальному часі. Kp індекс, сонячний вітер, прогноз геомагнітної активності та вплив на здоров'я. Дані NOAA щохвилини.",
  },
  about: {
    page_key: "about",
    title: "Про Магнітку — дані NOAA і прогноз магнітних бур",
    description:
      "Український сервіс моніторингу магнітних бур, Kp-індексу та космічної погоди на основі даних NOAA.",
  },
  contacts: {
    page_key: "contacts",
    title: "Контакти Магнітки — зворотний зв'язок і співпраця",
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
    title: "Політика конфіденційності Магнітки",
    description:
      "Політика конфіденційності сервісу Магнітка: cookie, аналітика та використання зовнішніх джерел даних.",
  },
  cookies: {
    page_key: "cookies",
    title: "Політика cookie Магнітки",
    description:
      "Політика cookie сервісу Магнітка: які cookie ми використовуємо, для чого вони потрібні та як керувати згодою.",
  },
  terms: {
    page_key: "terms",
    title: "Умови користування Магніткою",
    description:
      "Умови користування сервісом Магнітка: правила використання сайту, обмеження відповідальності та умови доступу до контенту.",
  },
  faq: {
    page_key: "faq",
    title: "Магнітні бурі: FAQ про Kp-індекс, сонячний вітер і вплив",
    description:
      "Часті питання про магнітні бурі, Kp-індекс, шкалу G1-G5, вплив на самопочуття та техніку.",
  },
  kp_index: {
    page_key: "kp_index",
    title: "Kp-індекс сьогодні — онлайн графік і прогноз магнітних бур",
    description:
      "Поточний Kp-індекс, шкала бурі G1-G5, графік та пояснення впливу геомагнітної активності.",
  },
  solar_wind: {
    page_key: "solar_wind",
    title: "Сонячний вітер сьогодні — швидкість, густина та IMF Bz онлайн",
    description:
      "Швидкість сонячного вітру, густина, IMF Bz та живий графік космічної погоди для відстеження магнітних бур.",
  },
  calendar: {
    page_key: "calendar",
    title: "Календар магнітних бур — прогноз геомагнітної активності",
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
    const supabase = getPageMetaClient();
    const { data, error } = await supabase
      .from("page_metadata")
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
  const supabase = getPageMetaClient();
  const { data, error } = await supabase
    .from("page_metadata")
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
  const supabase = getPageMetaClient();
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
    .select("id, title_uk, slug_uk, title_ru, slug_ru, title_pl, slug_pl, title_ro, slug_ro, title_hu, slug_hu, title_bg, slug_bg, title_cs, slug_cs, title_en, slug_en, published_at, source, status")
    .neq("source", "telegram_ai")
    .order("published_at", { ascending: false });

  if (error) {
    if (error.message.includes("does not exist")) {
      const fallback = await supabase
        .from("news")
        .select("id, title_uk, slug_uk, title_ru, slug_ru, published_at, source, status")
        .neq("source", "telegram_ai")
        .order("published_at", { ascending: false });

      if (fallback.error) {
        throw new Error(fallback.error.message);
      }

      return (fallback.data ?? []).map((item) => ({
        ...item,
        title_pl: null,
        slug_pl: null,
        title_ro: null,
        slug_ro: null,
        title_hu: null,
        slug_hu: null,
        title_bg: null,
        title_cs: null,
        slug_bg: null,
        slug_cs: null,
        title_en: null,
        slug_en: null,
      }));
    }

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
  title_pl: string | null;
  slug_pl: string | null;
  content_pl: string | null;
  title_ro: string | null;
  slug_ro: string | null;
  content_ro: string | null;
  title_hu: string | null;
  slug_hu: string | null;
  content_hu: string | null;
  title_bg: string | null;
  title_cs: string | null;
  slug_bg: string | null;
  slug_cs: string | null;
  content_bg: string | null;
  content_cs: string | null;
  title_en: string | null;
  slug_en: string | null;
  content_en: string | null;
  image_url: string | null;
  published_at: string;
  status: string;
  meta_title_uk: string | null;
  meta_description_uk: string | null;
  meta_title_ru: string | null;
  meta_description_ru: string | null;
  meta_title_pl: string | null;
  meta_description_pl: string | null;
  meta_title_ro: string | null;
  meta_description_ro: string | null;
  meta_title_hu: string | null;
  meta_description_hu: string | null;
  meta_title_bg: string | null;
  meta_title_cs: string | null;
  meta_description_bg: string | null;
  meta_description_cs: string | null;
  meta_title_en: string | null;
  meta_description_en: string | null;
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
    title_pl: string | null;
    slug_pl: string | null;
    content_pl: string | null;
    title_ro: string | null;
    slug_ro: string | null;
    content_ro: string | null;
    title_hu: string | null;
    slug_hu: string | null;
    content_hu: string | null;
    title_bg: string | null;
    title_cs: string | null;
    slug_bg: string | null;
    slug_cs: string | null;
    content_bg: string | null;
    content_cs: string | null;
    title_en: string | null;
    slug_en: string | null;
    content_en: string | null;
    image_url: string | null;
    published_at: string;
    status: string;
    meta_title_uk: string | null;
    meta_description_uk: string | null;
    meta_title_ru: string | null;
    meta_description_ru: string | null;
    meta_title_pl: string | null;
    meta_description_pl: string | null;
    meta_title_ro: string | null;
    meta_description_ro: string | null;
    meta_title_hu: string | null;
    meta_description_hu: string | null;
    meta_title_bg: string | null;
    meta_title_cs: string | null;
    meta_description_bg: string | null;
    meta_description_cs: string | null;
    meta_title_en: string | null;
    meta_description_en: string | null;
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

export async function listTestResultsAdmin(limit = 200) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("test_results")
    .select("id, created_at, locale, score, result_label, name, age, gender, has_chronic, physical_activity, answers, user_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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
