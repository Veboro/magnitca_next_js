import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStormNotesMode, setStormNotesMode, type StormNotesMode } from "@/lib/app-settings";

export const dynamic = "force-dynamic";

const MODES: StormNotesMode[] = ["moderation", "autopost"];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ mode: await getStormNotesMode() });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const mode = body?.mode as StormNotesMode | undefined;
    if (!mode || !MODES.includes(mode)) {
      return NextResponse.json({ error: "Invalid mode." }, { status: 400 });
    }

    await setStormNotesMode(mode);
    return NextResponse.json({ success: true, mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося зберегти режим." },
      { status: 500 },
    );
  }
}
