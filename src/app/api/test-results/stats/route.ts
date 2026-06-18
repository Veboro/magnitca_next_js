import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export const revalidate = 300;

type GenderBucket = "male" | "female" | "other";
type AgeGroupKey = "under18" | "18-29" | "30-39" | "40-49" | "50-59" | "60+";

type TestResultRow = {
  score: number | null;
  age: number | null;
  gender: string | null;
  has_chronic: boolean | null;
  created_at: string | null;
};

function normalizeGender(value: string | null): GenderBucket {
  const gender = (value || "").toLowerCase();

  if (
    gender.includes("жіноч") ||
    gender.includes("жен") ||
    gender.includes("kobiet") ||
    gender.includes("female") ||
    gender.includes("feminin") ||
    gender.includes("nő")
  ) {
    return "female";
  }

  if (
    gender.includes("чолов") ||
    gender.includes("муж") ||
    gender.includes("mężczy") ||
    gender.includes("male") ||
    gender.includes("masculin") ||
    gender.includes("férfi")
  ) {
    return "male";
  }

  return "other";
}

function getAgeGroup(age: number): AgeGroupKey {
  if (age < 18) return "under18";
  if (age < 30) return "18-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}

function average(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function strongestGroup<T extends string>(groups: Record<T, number[]>) {
  return (Object.entries(groups) as Array<[T, number[]]>)
    .map(([key, values]) => ({
      key,
      count: values.length,
      averageScore: average(values),
    }))
    .filter((item) => item.count > 0 && item.averageScore !== null)
    .sort((a, b) => {
      if ((b.averageScore ?? 0) !== (a.averageScore ?? 0)) {
        return (b.averageScore ?? 0) - (a.averageScore ?? 0);
      }
      return b.count - a.count;
    })[0] ?? null;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient() as any;
    const { data, error } = await supabase
      .from("test_results")
      .select("score, age, gender, has_chronic, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = ((data ?? []) as TestResultRow[]).filter((row) => {
      const score = Number(row.score);
      const age = Number(row.age);
      return Number.isFinite(score) && Number.isFinite(age) && age > 0 && age < 120;
    });

    const scores = rows.map((row) => Number(row.score));
    const genderGroups: Record<GenderBucket, number[]> = { male: [], female: [], other: [] };
    const ageGroups: Record<AgeGroupKey, number[]> = {
      under18: [],
      "18-29": [],
      "30-39": [],
      "40-49": [],
      "50-59": [],
      "60+": [],
    };
    const chronicScores: number[] = [];
    const nonChronicScores: number[] = [];
    const recentDate = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (const row of rows) {
      const score = Number(row.score);
      const age = Number(row.age);
      genderGroups[normalizeGender(row.gender)].push(score);
      ageGroups[getAgeGroup(age)].push(score);

      if (row.has_chronic) chronicScores.push(score);
      else nonChronicScores.push(score);
    }

    const recentCount = rows.filter((row) => {
      const timestamp = Date.parse(row.created_at || "");
      return Number.isFinite(timestamp) && timestamp >= recentDate;
    }).length;

    return NextResponse.json({
      total: rows.length,
      recentCount,
      averageScore: average(scores),
      highSensitivityShare: rows.length
        ? Math.round((scores.filter((score) => score >= 50).length / rows.length) * 100)
        : null,
      strongestGender: strongestGroup(genderGroups),
      strongestAgeGroup: strongestGroup(ageGroups),
      genderAverages: Object.fromEntries(
        (Object.entries(genderGroups) as Array<[GenderBucket, number[]]>).map(([key, values]) => [
          key,
          { count: values.length, averageScore: average(values) },
        ])
      ),
      ageAverages: Object.fromEntries(
        (Object.entries(ageGroups) as Array<[AgeGroupKey, number[]]>).map(([key, values]) => [
          key,
          { count: values.length, averageScore: average(values) },
        ])
      ),
      chronicAverage: average(chronicScores),
      nonChronicAverage: average(nonChronicScores),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load test statistics." },
      { status: 500 }
    );
  }
}
