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
      title_pl: body.title_pl || null,
      slug_pl: body.slug_pl || null,
      content_pl: body.content_pl || null,
      title_ro: body.title_ro || null,
      slug_ro: body.slug_ro || null,
      content_ro: body.content_ro || null,
      title_hu: body.title_hu || null,
      slug_hu: body.slug_hu || null,
      content_hu: body.content_hu || null,
      title_bg: body.title_bg || null,
      title_cs: body.title_cs || null,
      slug_bg: body.slug_bg || null,
      slug_cs: body.slug_cs || null,
      content_bg: body.content_bg || null,
      content_cs: body.content_cs || null,
      title_en: body.title_en || null,
      slug_en: body.slug_en || null,
      content_en: body.content_en || null,
      image_url: body.image_url || null,
      published_at: new Date(body.published_at).toISOString(),
      status: body.status === "published" ? "published" : "draft",
      meta_title_uk: body.meta_title_uk || null,
      meta_description_uk: body.meta_description_uk || null,
      meta_title_ru: body.meta_title_ru || null,
      meta_description_ru: body.meta_description_ru || null,
      meta_title_pl: body.meta_title_pl || null,
      meta_description_pl: body.meta_description_pl || null,
      meta_title_ro: body.meta_title_ro || null,
      meta_description_ro: body.meta_description_ro || null,
      meta_title_hu: body.meta_title_hu || null,
      meta_description_hu: body.meta_description_hu || null,
      meta_title_bg: body.meta_title_bg || null,
      meta_title_cs: body.meta_title_cs || null,
      meta_description_bg: body.meta_description_bg || null,
      meta_description_cs: body.meta_description_cs || null,
      meta_title_en: body.meta_title_en || null,
      meta_description_en: body.meta_description_en || null,
      source: body.source || "manual",
    });

    safeRevalidatePaths([
      "/",
      "/ru",
      "/pl",
      "/ro",
      "/hu",
      "/bg",
      "/cs",
      "/en",
      "/news",
      "/ru/news",
      "/pl/news",
      "/ro/news",
      "/hu/news",
      "/bg/news",
      "/cs/news",
      "/en/news",
      "/rss.xml",
      "/sitemap.xml",
      news.slug_uk || news.id ? `/news/${news.slug_uk || news.id}` : "",
      news.slug_ru ? `/ru/news/${news.slug_ru}` : "",
      news.slug_pl ? `/pl/news/${news.slug_pl}` : "",
      news.slug_ro ? `/ro/news/${news.slug_ro}` : "",
      news.slug_hu ? `/hu/news/${news.slug_hu}` : "",
      news.slug_bg ? `/bg/news/${news.slug_bg}` : "",
      news.slug_cs ? `/cs/news/${news.slug_cs}` : "",
      news.slug_en ? `/en/news/${news.slug_en}` : "",
    ].filter(Boolean));

    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося створити новину." },
      { status: 500 }
    );
  }
}
