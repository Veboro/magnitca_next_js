import { getSupabaseAdminClient } from "@/lib/server-supabase";

export type StormNotesMode = "moderation" | "autopost";

const STORM_NOTES_MODE_KEY = "storm_notes_mode";

function normalizeMode(value: unknown): StormNotesMode {
  return value === "autopost" ? "autopost" : "moderation";
}

export async function getStormNotesMode(): Promise<StormNotesMode> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("app_settings" as never)
      .select("value")
      .eq("key", STORM_NOTES_MODE_KEY)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return normalizeMode((data as { value?: string } | null)?.value);
  } catch {
    // Fail safe: if the setting can't be read, keep notes gated behind moderation.
    return "moderation";
  }
}

export async function setStormNotesMode(mode: StormNotesMode): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("app_settings" as never)
    .upsert({ key: STORM_NOTES_MODE_KEY, value: mode, updated_at: new Date().toISOString() } as never, {
      onConflict: "key",
    });

  if (error) {
    throw new Error(error.message);
  }
}
