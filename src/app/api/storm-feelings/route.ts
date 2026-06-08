import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { SiteLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

type StormFeelingRow = {
  feels_storm: boolean;
};

type StormFeelingStats = {
  date: string;
  total: number;
  yes: number;
  no: number;
  yesPercent: number;
  noPercent: number;
};

const LOCALES = new Set<SiteLocale>(["uk", "ru", "pl", "ro", "hu", "en"]);

function getKyivDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizeLocale(value: unknown): SiteLocale {
  return typeof value === "string" && LOCALES.has(value as SiteLocale)
    ? (value as SiteLocale)
    : "uk";
}

function hashAnonymousId(anonymousId: string) {
  const salt =
    process.env.STORM_FEELING_HASH_SALT ??
    process.env.APP_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "magnitca-storm-feelings";

  return createHash("sha256").update(`${salt}:${anonymousId}`).digest("hex");
}

function buildStats(date: string, rows: StormFeelingRow[]): StormFeelingStats {
  const total = rows.length;
  const yes = rows.filter((row) => row.feels_storm).length;
  const no = Math.max(0, total - yes);
  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;

  return {
    date,
    total,
    yes,
    no,
    yesPercent,
    noPercent: total > 0 ? 100 - yesPercent : 0,
  };
}

async function readStats(date: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("daily_storm_feelings" as never)
    .select("feels_storm")
    .eq("response_date", date);

  if (error) {
    throw error;
  }

  return buildStats(date, (data ?? []) as unknown as StormFeelingRow[]);
}

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") ?? getKyivDateKey();
    return NextResponse.json(await readStats(date));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load storm feeling stats.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const anonymousId = typeof body?.anonymousId === "string" ? body.anonymousId.trim() : "";
    const feelsStorm = body?.feelsStorm;

    if (anonymousId.length < 16 || anonymousId.length > 128) {
      return NextResponse.json({ error: "Invalid anonymous id." }, { status: 400 });
    }

    if (typeof feelsStorm !== "boolean") {
      return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
    }

    const responseDate = getKyivDateKey();
    const anonymousIdHash = hashAnonymousId(anonymousId);
    const locale = normalizeLocale(body?.locale);
    const kpNow = typeof body?.kpNow === "number" && Number.isFinite(body.kpNow) ? body.kpNow : null;
    const kpTodayMax =
      typeof body?.kpTodayMax === "number" && Number.isFinite(body.kpTodayMax) ? body.kpTodayMax : null;

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("daily_storm_feelings" as never)
      .upsert(
        {
          response_date: responseDate,
          anonymous_id_hash: anonymousIdHash,
          locale,
          feels_storm: feelsStorm,
          kp_now: kpNow,
          kp_today_max: kpTodayMax,
        } as never,
        { onConflict: "response_date,anonymous_id_hash" },
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      answer: feelsStorm,
      stats: await readStats(responseDate),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save storm feeling answer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
