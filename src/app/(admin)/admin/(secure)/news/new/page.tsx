import { NewsEditorForm } from "@/components/admin/news-editor-form-next";

function getKyivNow() {
  const now = new Date();
  const kyiv = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }));
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${kyiv.getFullYear()}-${pad(kyiv.getMonth() + 1)}-${pad(kyiv.getDate())}T${pad(kyiv.getHours())}:${pad(kyiv.getMinutes())}`;
}

export default function AdminNewsCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">News editor</p>
        <h1 className="font-display text-3xl font-bold">Нова новина</h1>
      </div>
      <NewsEditorForm
        mode="create"
        initial={{
          title_uk: "",
          slug_uk: "",
          content_uk: "",
          title_ru: "",
          slug_ru: "",
          content_ru: "",
          title_pl: "",
          slug_pl: "",
          content_pl: "",
          title_ro: "",
          slug_ro: "",
          content_ro: "",
          title_hu: "",
          slug_hu: "",
          content_hu: "",
          title_en: "",
          slug_en: "",
          content_en: "",
          image_url: "",
          published_at: getKyivNow(),
          status: "draft",
          meta_title_uk: "",
          meta_description_uk: "",
          meta_title_ru: "",
          meta_description_ru: "",
          meta_title_pl: "",
          meta_description_pl: "",
          meta_title_ro: "",
          meta_description_ro: "",
          meta_title_hu: "",
          meta_description_hu: "",
          meta_title_en: "",
          meta_description_en: "",
          source: "manual",
        }}
      />
    </div>
  );
}
