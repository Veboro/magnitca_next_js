import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { safeRevalidatePaths } from "@/lib/revalidate";
import { setStormNoteStatus, STORM_NOTE_STATUSES, type StormNoteStatus } from "@/lib/admin-storm-notes";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The public feed is cached; approving/rejecting a note must refresh every locale page.
const FEED_PATHS = ["/", "/ru", "/pl", "/ro", "/hu", "/en", "/feeling", "/ru/feeling", "/pl/feeling", "/ro/feeling", "/hu/feeling", "/en/feeling"];

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid note id." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const status = body?.status as StormNoteStatus | undefined;
    if (!status || !STORM_NOTE_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await setStormNoteStatus(id, status);
    safeRevalidatePaths(FEED_PATHS);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося оновити відгук." },
      { status: 500 },
    );
  }
}
