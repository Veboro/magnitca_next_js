import { getSupabaseAdminClient } from "@/lib/server-supabase";

export type StormNoteStatus = "pending" | "approved" | "rejected";

export const STORM_NOTE_STATUSES: StormNoteStatus[] = ["pending", "approved", "rejected"];

export type StormNoteAdminRow = {
  id: string;
  response_date: string;
  locale: string;
  feeling_score: number;
  body: string;
  display_name: string | null;
  age: number | null;
  gender: string | null;
  kp_now: number | null;
  status: StormNoteStatus;
  helpful_count: number | null;
  created_at: string | null;
};

const SELECT_COLUMNS =
  "id, response_date, locale, feeling_score, body, display_name, age, gender, kp_now, status, helpful_count, created_at";

export async function listStormNotesAdmin(status: StormNoteStatus, limit = 200): Promise<StormNoteAdminRow[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("storm_feeling_notes" as never)
    .select(SELECT_COLUMNS)
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as StormNoteAdminRow[];
}

export async function getStormNoteCounts(): Promise<Record<StormNoteStatus, number>> {
  const supabase = getSupabaseAdminClient();
  const counts: Record<StormNoteStatus, number> = { pending: 0, approved: 0, rejected: 0 };

  await Promise.all(
    STORM_NOTE_STATUSES.map(async (status) => {
      const { count, error } = await supabase
        .from("storm_feeling_notes" as never)
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      if (error) {
        throw new Error(error.message);
      }
      counts[status] = count ?? 0;
    }),
  );

  return counts;
}

export async function setStormNoteStatus(id: string, status: StormNoteStatus): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("storm_feeling_notes" as never)
    .update({ status } as never)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
