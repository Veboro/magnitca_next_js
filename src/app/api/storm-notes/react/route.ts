import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function hashAnonymousId(anonymousId: string) {
  const salt =
    process.env.STORM_FEELING_HASH_SALT ??
    process.env.APP_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "magnitca-storm-feelings";

  return createHash("sha256").update(`${salt}:${anonymousId}`).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const noteId = typeof body?.noteId === "string" ? body.noteId.trim() : "";
    const anonymousId = typeof body?.anonymousId === "string" ? body.anonymousId.trim() : "";

    if (!UUID_RE.test(noteId)) {
      return NextResponse.json({ error: "Invalid note id." }, { status: 400 });
    }
    if (anonymousId.length < 16 || anonymousId.length > 128) {
      return NextResponse.json({ error: "Invalid anonymous id." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.rpc("react_to_storm_note" as never, {
      p_note_id: noteId,
      p_hash: hashAnonymousId(anonymousId),
    } as never);

    if (error) {
      throw error;
    }

    return NextResponse.json({ helpfulCount: typeof data === "number" ? data : 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to react.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
