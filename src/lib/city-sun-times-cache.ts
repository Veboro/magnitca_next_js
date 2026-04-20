import type { CitySunTimesPayload } from "@/lib/city-sun-times";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export async function getCitySunTimesCache(cacheKey: string): Promise<CitySunTimesPayload | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = (await supabase
      .from("city_sun_times_cache" as any)
      .select("payload")
      .eq("cache_key", cacheKey)
      .maybeSingle()) as { data: { payload?: CitySunTimesPayload } | null; error: { message: string } | null };

    if (error) {
      console.warn("[city-sun-times-cache] read failed", error.message);
      return null;
    }

    return (data?.payload as CitySunTimesPayload | null) ?? null;
  } catch (error) {
    console.warn("[city-sun-times-cache] unavailable", error);
    return null;
  }
}

export async function setCitySunTimesCache(cacheKey: string, payload: CitySunTimesPayload) {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("city_sun_times_cache" as any)
      .upsert({
        cache_key: cacheKey,
        payload,
      });

    if (error) {
      console.warn("[city-sun-times-cache] write failed", error.message);
    }
  } catch (error) {
    console.warn("[city-sun-times-cache] unavailable", error);
  }
}
