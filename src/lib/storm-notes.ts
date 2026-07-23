import { getSupabaseAdminClient } from "@/lib/server-supabase";

export type StormNote = {
  id: string;
  locale: string;
  body: string;
  feeling_score: number;
  response_date: string;
  display_name: string | null;
  age: number | null;
  gender: string | null;
  kp_now: number | null;
  helpful_count: number | null;
  created_at: string | null;
};

export type ApprovedNotesResult = {
  notes: StormNote[];
  hasMore: boolean;
  nextOffset: number;
};

const SELECT_COLUMNS =
  "id, locale, body, feeling_score, response_date, display_name, age, gender, kp_now, helpful_count, created_at";

export function getKyivDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export type FetchApprovedNotesOptions = {
  days?: number;
  date?: string | null;
  minAge?: number | null;
  gender?: string | null;
  locales?: string[] | null;
  locale?: string | null;
  priorityLocale?: string | null;
  limit?: number;
  offset?: number;
};

/**
 * Reads the public "storm feeling" feed: approved notes only, newest day first.
 * When `priorityLocale` is set the preferred language is stably lifted to the
 * top of the whole window before pagination, so a locale page leads with its
 * own reviews regardless of insertion order.
 */
export async function fetchApprovedNotes(options: FetchApprovedNotesOptions = {}): Promise<ApprovedNotesResult> {
  const limit = Number.isFinite(options.limit) ? Math.min(30, Math.max(1, Math.trunc(options.limit as number))) : 12;
  const offset = Number.isFinite(options.offset) && (options.offset as number) > 0 ? Math.trunc(options.offset as number) : 0;
  const days = Number.isFinite(options.days) ? Math.min(30, Math.max(1, Math.trunc(options.days as number))) : 7;
  const since = getKyivDateKey(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));
  const priorityLocale = options.priorityLocale || null;

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("storm_feeling_notes" as never)
    .select(SELECT_COLUMNS)
    .eq("status", "approved")
    .order("response_date", { ascending: false })
    .order("created_at", { ascending: false });

  // Priority ordering needs the full window in memory to stable-partition the
  // preferred locale first; otherwise page against the DB with range().
  query = priorityLocale ? query.limit(500) : query.range(offset, offset + limit);

  query = options.date ? query.eq("response_date", options.date) : query.gte("response_date", since);
  if (options.minAge) query = query.gte("age", options.minAge);
  if (options.gender) query = query.eq("gender", options.gender);
  if (options.locales && options.locales.length > 0) {
    query = query.in("locale", options.locales);
  } else if (options.locale) {
    query = query.eq("locale", options.locale);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as unknown as StormNote[];

  if (priorityLocale) {
    const ordered = [...rows].sort(
      (a, b) => Number(b.locale === priorityLocale) - Number(a.locale === priorityLocale),
    );
    const notes = ordered.slice(offset, offset + limit);
    return { notes, hasMore: ordered.length > offset + notes.length, nextOffset: offset + notes.length };
  }

  const hasMore = rows.length > limit;
  const notes = hasMore ? rows.slice(0, limit) : rows;
  return { notes, hasMore, nextOffset: offset + notes.length };
}
