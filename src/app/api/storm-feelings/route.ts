import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { SiteLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

type StormFeelingRow = {
  feels_storm: boolean;
  feeling_score: number | null;
  created_at: string | null;
};

type StormFeelingStats = {
  date: string;
  total: number;
  yes: number;
  no: number;
  better: number;
  neutral: number;
  worse: number;
  scoreCounts: Array<{
    score: number;
    count: number;
    percent: number;
  }>;
  timeline: Array<{
    label: string;
    total: number;
    averageScore: number;
    worsePercent: number;
  }>;
  yesPercent: number;
  noPercent: number;
  averageScore: number;
};

const LOCALES = new Set<SiteLocale>(["uk", "ru", "pl", "ro", "hu", "bg", "cs", "en"]);

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

function getKyivDayStartUtc(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  // Ukraine is UTC+3 during the active season of this product. The date is
  // still filtered by response_date in the database, so this only builds chart buckets.
  return new Date(Date.UTC(year, month - 1, day, 21, 0, 0));
}

function formatKyivHour(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildStats(date: string, rows: StormFeelingRow[]): StormFeelingStats {
  const total = rows.length;
  const scores = rows.map((row) => row.feeling_score ?? (row.feels_storm ? 2 : 0));
  const yes = scores.filter((score) => score > 0).length;
  const no = Math.max(0, total - yes);
  const better = scores.filter((score) => score < 0).length;
  const neutral = scores.filter((score) => score === 0).length;
  const worse = yes;
  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;
  const averageScore = total > 0 ? Number((scores.reduce((sum, score) => sum + score, 0) / total).toFixed(2)) : 0;
  const scoreCounts = [-3, -2, -1, 0, 1, 2, 3].map((score) => {
    const count = scores.filter((value) => value === score).length;
    return {
      score,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
  const dayStart = getKyivDayStartUtc(date);
  const isToday = date === getKyivDateKey();
  const endDate = isToday ? new Date() : new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const bucketMs = 2 * 60 * 60 * 1000;
  const bucketTimes: Date[] = [];

  for (let time = dayStart.getTime(); time <= endDate.getTime(); time += bucketMs) {
    bucketTimes.push(new Date(time));
  }

  if (!bucketTimes.length || bucketTimes[bucketTimes.length - 1].getTime() < endDate.getTime()) {
    bucketTimes.push(endDate);
  }

  const timeline = bucketTimes.map((bucketTime) => {
    const bucketRows = rows.filter((row) => {
      const createdAt = row.created_at ? new Date(row.created_at) : null;
      return createdAt && createdAt.getTime() <= bucketTime.getTime();
    });
    const bucketScores = bucketRows.map((row) => row.feeling_score ?? (row.feels_storm ? 2 : 0));
    const bucketTotal = bucketScores.length;
    const bucketWorse = bucketScores.filter((score) => score > 0).length;

    return {
      label: formatKyivHour(bucketTime),
      total: bucketTotal,
      averageScore: bucketTotal > 0 ? Number((bucketScores.reduce((sum, score) => sum + score, 0) / bucketTotal).toFixed(2)) : 0,
      worsePercent: bucketTotal > 0 ? Math.round((bucketWorse / bucketTotal) * 100) : 0,
    };
  });

  return {
    date,
    total,
    yes,
    no,
    better,
    neutral,
    worse,
    scoreCounts,
    timeline,
    yesPercent,
    noPercent: total > 0 ? 100 - yesPercent : 0,
    averageScore,
  };
}

async function readStats(date: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("daily_storm_feelings" as never)
    .select("feels_storm, feeling_score, created_at")
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
    const feelingScore =
      typeof body?.feelingScore === "number" && Number.isInteger(body.feelingScore) && body.feelingScore >= -3 && body.feelingScore <= 3
        ? body.feelingScore
        : typeof body?.feelsStorm === "boolean"
          ? body.feelsStorm
            ? 2
            : 0
          : null;

    if (anonymousId.length < 16 || anonymousId.length > 128) {
      return NextResponse.json({ error: "Invalid anonymous id." }, { status: 400 });
    }

    if (feelingScore === null) {
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
          feels_storm: feelingScore > 0,
          feeling_score: feelingScore,
          kp_now: kpNow,
          kp_today_max: kpTodayMax,
        } as never,
        { onConflict: "response_date,anonymous_id_hash" },
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      answer: feelingScore > 0,
      feelingScore,
      stats: await readStats(responseDate),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save storm feeling answer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
