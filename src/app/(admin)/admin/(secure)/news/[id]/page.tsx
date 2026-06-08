import { notFound } from "next/navigation";
import { NewsEditorForm } from "@/components/admin/news-editor-form-next";
import { getNewsAdmin } from "@/lib/admin-content";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsEditPage({ params }: Params) {
  const { id } = await params;

  let news;
  try {
    news = await getNewsAdmin(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">News editor</p>
        <h1 className="font-display text-3xl font-bold">Редагування новини</h1>
      </div>
      <NewsEditorForm
        mode="edit"
        initial={{
          id: news.id,
          title_uk: news.title_uk || news.title || "",
          slug_uk: news.slug_uk || news.slug || "",
          content_uk: news.content_uk || news.content || "",
          title_ru: news.title_ru || "",
          slug_ru: news.slug_ru || "",
          content_ru: news.content_ru || "",
          title_pl: news.title_pl || "",
          slug_pl: news.slug_pl || "",
          content_pl: news.content_pl || "",
          title_ro: news.title_ro || "",
          slug_ro: news.slug_ro || "",
          content_ro: news.content_ro || "",
          title_hu: news.title_hu || "",
          slug_hu: news.slug_hu || "",
          content_hu: news.content_hu || "",
          title_en: news.title_en || "",
          slug_en: news.slug_en || "",
          content_en: news.content_en || "",
          image_url: news.image_url || "",
          published_at: news.published_at.slice(0, 16),
          status: news.status === "published" ? "published" : "draft",
          meta_title_uk: news.meta_title_uk || news.meta_title || "",
          meta_description_uk: news.meta_description_uk || news.meta_description || "",
          meta_title_ru: news.meta_title_ru || "",
          meta_description_ru: news.meta_description_ru || "",
          meta_title_pl: news.meta_title_pl || "",
          meta_description_pl: news.meta_description_pl || "",
          meta_title_ro: news.meta_title_ro || "",
          meta_description_ro: news.meta_description_ro || "",
          meta_title_hu: news.meta_title_hu || "",
          meta_description_hu: news.meta_description_hu || "",
          meta_title_en: news.meta_title_en || "",
          meta_description_en: news.meta_description_en || "",
          source: news.source || "manual",
        }}
      />
    </div>
  );
}
