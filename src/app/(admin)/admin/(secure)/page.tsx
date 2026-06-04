import Link from "next/link";
import { listNewsAdmin, listPageMeta } from "@/lib/admin-content";

export default async function AdminDashboardPage() {
  const [news, pages] = await Promise.all([listNewsAdmin(), listPageMeta()]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Новини</p>
        <h2 className="mt-2 font-display text-3xl font-bold">{news.length}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Матеріалів доступно для редагування.</p>
        <Link href="/admin/news" className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40">
          Відкрити список новин
        </Link>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">SEO-сторінки</p>
        <h2 className="mt-2 font-display text-3xl font-bold">{pages.length}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Ключових маршрутів із керованими метаданими.</p>
        <Link href="/admin/seo" className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40">
          Редагувати metadata
        </Link>
      </div>
    </div>
  );
}
