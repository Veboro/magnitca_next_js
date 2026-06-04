import Link from "next/link";
import { listNewsAdmin } from "@/lib/admin-content";
import { DeleteNewsButton } from "@/components/admin/delete-news-button";

export default async function AdminNewsPage() {
  const news = await listNewsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">News</p>
          <h1 className="font-display text-3xl font-bold">Управління новинами</h1>
        </div>
        <Link href="/admin/news/new" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
          Створити новину
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Дії</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t border-border/30">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="font-medium">{item.title_uk || "—"}</div>
                    <div className="text-xs text-muted-foreground">{item.title_ru || "—"}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {item.status === "published" ? "Опубліковано" : "Чернетка"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(item.published_at).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <div>{item.slug_uk || "—"}</div>
                    <div>{item.slug_ru || "—"}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/news/${item.id}`} className="text-primary hover:underline">
                      Редагувати
                    </Link>
                    <DeleteNewsButton id={item.id} title={item.title_uk || item.title_ru || item.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
