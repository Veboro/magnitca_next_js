import { NextRequest, NextResponse } from "next/server";
import { fetchUhmcWarning } from "@/lib/uhmc-warning";
import type { SiteLocale } from "@/lib/locale";

function getLocale(value: string | null): Extract<SiteLocale, "uk" | "ru"> {
  return value === "ru" ? "ru" : "uk";
}

export async function GET(request: NextRequest) {
  const regionCode = Number(request.nextUrl.searchParams.get("regionCode"));
  const locale = getLocale(request.nextUrl.searchParams.get("locale"));

  if (!Number.isFinite(regionCode)) {
    return NextResponse.json({ error: "Invalid region code" }, { status: 400 });
  }

  try {
    const payload = await fetchUhmcWarning(regionCode, locale);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: "none",
        updatedAt: null,
        level: null,
        types: [],
        periods: [],
        details: [],
        summary: locale === "ru" ? "Попередження тимчасово недоступні" : "Попередження тимчасово недоступні",
        sourceUrl: "https://www.meteo.gov.ua/ua/Meteorolohichni-poperedzhennya",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      }
    );
  }
}
