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
          image_url: news.image_url || "",
          published_at: news.published_at.slice(0, 16),
          status: news.status === "published" ? "published" : "draft",
          meta_title_uk: news.meta_title_uk || news.meta_title || "",
          meta_description_uk: news.meta_description_uk || news.meta_description || "",
          meta_title_ru: news.meta_title_ru || "",
          meta_description_ru: news.meta_description_ru || "",
          source: news.source || "manual",
        }}
      />
    </div>
  );
}
