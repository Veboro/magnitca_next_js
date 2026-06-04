import { SeoEditorForm } from "@/components/admin/seo-editor-form";
import { listPageMeta } from "@/lib/admin-content";

export default async function AdminSeoPage() {
  const items = await listPageMeta();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">SEO</p>
        <h1 className="font-display text-3xl font-bold">Метадані сторінок</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Тут редагуються серверні title та description для ключових сторінок сайту. Метадані новин
          керуються в редакторі конкретної новини, а title/description сторінок міст поки що
          формуються з міських конфігів та live-даних.
        </p>
      </div>
      <SeoEditorForm initialItems={items} />
    </div>
  );
}
