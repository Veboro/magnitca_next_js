import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { upsertPageMeta } from "@/lib/admin-content";

const pagePathByKey: Record<string, string> = {
  home: "/",
  about: "/about",
  contacts: "/contacts",
  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
  faq: "/faq",
  kp_index: "/kp-index",
  solar_wind: "/solar-wind",
  calendar: "/calendar",
  news: "/news",
};

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await upsertPageMeta({
      page_key: body.page_key,
      title: body.title,
      description: body.description,
    });

    const path = pagePathByKey[body.page_key];
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося зберегти metadata." },
      { status: 500 }
    );
  }
}
