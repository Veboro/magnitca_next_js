import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import { getStormNotesMode } from "@/lib/app-settings";
import { fetchApprovedNotes, getKyivDateKey } from "@/lib/storm-notes";
import { safeRevalidatePaths } from "@/lib/revalidate";
import type { SiteLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

const LOCALES = new Set<SiteLocale>(["uk", "ru", "pl", "ro", "hu", "en"]);
const GENDERS = new Set(["female", "male"]);

// Cached feed pages to refresh when an approved note appears.
const FEED_PATHS = ["/", "/ru", "/pl", "/ro", "/hu", "/en", "/feeling", "/ru/feeling", "/pl/feeling", "/ro/feeling", "/hu/feeling", "/en/feeling"];

// Auto-prefilter: hold/reject anything that looks like spam (links, handles, contacts).
const LINK_RE =
  /(https?:\/\/|www\.|t\.me\/|@[\w.]+|\b[\w.-]+\.(?:com|net|org|ru|ua|pl|ro|hu|info|xyz|top|shop|site|online)\b|\+?\d[\d\s()-]{8,}\d)/i;

function normalizeLocale(value: unknown): SiteLocale {
  return typeof value === "string" && LOCALES.has(value as SiteLocale) ? (value as SiteLocale) : "uk";
}

function hashAnonymousId(anonymousId: string) {
  const salt =
    process.env.STORM_FEELING_HASH_SALT ??
    process.env.APP_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "magnitca-storm-feelings";

  return createHash("sha256").update(`${salt}:${anonymousId}`).digest("hex");
}

function sanitizeText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const anonymousId = typeof body?.anonymousId === "string" ? body.anonymousId.trim() : "";
    const text = sanitizeText(body?.body, 280);
    const feelingScore =
      typeof body?.feelingScore === "number" &&
      Number.isInteger(body.feelingScore) &&
      body.feelingScore >= -3 &&
      body.feelingScore <= 3
        ? body.feelingScore
        : null;
    const displayName = sanitizeText(body?.displayName, 60) || null;
    const age =
      typeof body?.age === "number" && Number.isInteger(body.age) && body.age >= 1 && body.age <= 120
        ? body.age
        : null;
    const gender = typeof body?.gender === "string" && GENDERS.has(body.gender) ? body.gender : null;
    const locale = normalizeLocale(body?.locale);
    const kpNow = typeof body?.kpNow === "number" && Number.isFinite(body.kpNow) ? body.kpNow : null;

    if (anonymousId.length < 16 || anonymousId.length > 128) {
      return NextResponse.json({ error: "Invalid anonymous id." }, { status: 400 });
    }
    if (feelingScore === null) {
      return NextResponse.json({ error: "Invalid feeling score." }, { status: 400 });
    }
    if (text.length < 3) {
      return NextResponse.json({ error: "Note is too short." }, { status: 400 });
    }

    // Obvious spam is always rejected. Otherwise the site-wide mode decides:
    // `moderation` holds the note as pending; `autopost` publishes it immediately.
    const isSpam = LINK_RE.test(text) || LINK_RE.test(displayName ?? "");
    const mode = await getStormNotesMode();
    const status = isSpam ? "rejected" : mode === "autopost" ? "approved" : "pending";

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("storm_feeling_notes" as never).upsert(
      {
        response_date: getKyivDateKey(),
        anonymous_id_hash: hashAnonymousId(anonymousId),
        locale,
        feeling_score: feelingScore,
        body: text,
        display_name: displayName,
        age,
        gender,
        kp_now: kpNow,
        status,
      } as never,
      { onConflict: "response_date,anonymous_id_hash" },
    );

    if (error) {
      throw error;
    }

    // Autopost publishes instantly, so refresh the cached feed pages right away.
    if (status === "approved") {
      safeRevalidatePaths(FEED_PATHS);
    }

    return NextResponse.json({ status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const daysParam = Number(params.get("days"));
    const days = Number.isFinite(daysParam) ? days_(daysParam) : 7;

    // `date` (YYYY-MM-DD) pins the feed to a single day chosen in the calendar.
    const dateParam = params.get("date");
    const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : null;

    // `minAge` keeps only notes from people at or above the chosen age.
    const minAgeParam = Number(params.get("minAge"));
    const minAge = Number.isFinite(minAgeParam) && minAgeParam > 0 ? Math.trunc(minAgeParam) : null;

    // `gender` narrows the feed to one gender.
    const genderParam = params.get("gender");
    const gender = genderParam && GENDERS.has(genderParam) ? genderParam : null;

    const limitParam = Number(params.get("limit"));
    const limit = Number.isFinite(limitParam) ? limitParam : 12;
    const offsetParam = Number(params.get("offset"));
    const offset = Number.isFinite(offsetParam) && offsetParam > 0 ? Math.trunc(offsetParam) : 0;

    // `priority` floats one locale's notes to the top so a language page leads
    // with its own reviews regardless of insertion order.
    const priorityParam = params.get("priority");
    const priorityLocale =
      priorityParam && LOCALES.has(priorityParam as SiteLocale) ? (priorityParam as SiteLocale) : null;

    // `locales` (comma list) groups sibling languages of one country; `locale` filters a single one.
    const localesParam = params.get("locales");
    const localeParam = params.get("locale");
    const locales = localesParam
      ? localesParam
          .split(",")
          .map((value) => value.trim())
          .filter((value): value is SiteLocale => LOCALES.has(value as SiteLocale))
      : null;
    const singleLocale = localeParam && LOCALES.has(localeParam as SiteLocale) ? localeParam : null;

    const result = await fetchApprovedNotes({
      days,
      date,
      minAge,
      gender,
      locales,
      locale: singleLocale,
      priorityLocale,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load notes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function days_(value: number) {
  return Math.min(30, Math.max(1, Math.trunc(value)));
}
