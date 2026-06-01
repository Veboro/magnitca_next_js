import { NextRequest, NextResponse } from "next/server";
import { fetchHungaroMetWarning } from "@/lib/hungaromet-warning";

export async function GET(request: NextRequest) {
  const county = request.nextUrl.searchParams.get("county");

  if (!county) {
    return NextResponse.json({ error: "Invalid county" }, { status: 400 });
  }

  try {
    const payload = await fetchHungaroMetWarning(county);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
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
        summary: "A figyelmeztetés átmenetileg nem érhető el",
        sourceUrl: "https://www.met.hu/idojaras/veszelyjelzes/figyelmezteto_elorejelzes_mara/",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
