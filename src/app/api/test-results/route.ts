import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { SiteLocale } from "@/lib/locale";

const LOCALES: SiteLocale[] = ["uk", "ru", "pl", "ro", "hu", "en"];

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || "";
}

function hashValue(value: string) {
  if (!value) return null;
  const salt = process.env.TEST_RESULT_HASH_SALT || process.env.APP_SUPABASE_SERVICE_ROLE_KEY || "magnitca";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function clampScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function normalizeLocale(value: unknown): SiteLocale {
  return LOCALES.includes(value as SiteLocale) ? (value as SiteLocale) : "uk";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const score = clampScore(body.score);
    const age = Number.parseInt(String(body.age ?? ""), 10);
    const name = String(body.name ?? "").trim().slice(0, 120);
    const gender = String(body.gender ?? "").trim().slice(0, 80);
    const physicalActivity = String(body.physicalActivity ?? "").trim().slice(0, 120);
    const resultLabel = String(body.resultLabel ?? "").trim().slice(0, 160);
    const answers = Array.isArray(body.answers)
      ? body.answers.map((answer) => Number(answer)).filter((answer) => Number.isFinite(answer)).slice(0, 40)
      : [];

    if (score === null || !name || !gender || !physicalActivity || !Number.isInteger(age) || age <= 0 || age >= 120) {
      return NextResponse.json({ error: "Invalid test result payload." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        user_id: null,
        score,
        name,
        age,
        gender,
        has_chronic: Boolean(body.hasChronic),
        answers,
        locale: normalizeLocale(body.locale),
        physical_activity: physicalActivity,
        result_label: resultLabel || null,
        ip_hash: hashValue(getClientIp(request)),
        user_agent: (request.headers.get("user-agent") || "").slice(0, 500) || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save test result." },
      { status: 500 }
    );
  }
}
