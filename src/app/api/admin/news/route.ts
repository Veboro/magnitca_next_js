import { NextResponse } from "next/server";
import { createNewsAdmin } from "@/lib/admin-content";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { safeRevalidatePaths } from "@/lib/revalidate";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const news = await createNewsAdmin({
      title_uk: body.title_uk,
      slug_uk: body.slug_uk || null,
      content_uk: body.content_uk,
      title_ru: body.title_ru || null,
      slug_ru: body.slug_ru || null,
      content_ru: body.content_ru || null,
      image_url: body.image_url || null,
      published_at: new Date(body.published_at).toISOString(),
      status: body.status === "published" ? "published" : "draft",
      meta_title_uk: body.meta_title_uk || null,
      meta_description_uk: body.meta_description_uk || null,
      meta_title_ru: body.meta_title_ru || null,
      meta_description_ru: body.meta_description_ru || null,
      source: body.source || "manual",
    });

    safeRevalidatePaths([
      "/",
      "/ru",
      "/news",
      "/ru/news",
      "/rss.xml",
      "/sitemap.xml",
      news.slug_uk || news.id ? `/news/${news.slug_uk || news.id}` : "",
      news.slug_ru ? `/ru/news/${news.slug_ru}` : "",
    ].filter(Boolean));

    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося створити новину." },
      { status: 500 }
    );
  }
}
