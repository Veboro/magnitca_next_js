import Link from "next/link";
import { listNewsAdmin } from "@/lib/admin-content";
import { DeleteNewsButton } from "@/components/admin/delete-news-button";

const NEWS_LOCALES = [
  { code: "uk", label: "UA" },
  { code: "ru", label: "RU" },
  { code: "pl", label: "PL" },
  { code: "ro", label: "RO" },
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
] as const;

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
                    <div className="flex flex-wrap gap-1 pt-1">
                      {NEWS_LOCALES.map((locale) => {
                        const hasTranslation = Boolean(
                          item[`title_${locale.code}`] && item[`slug_${locale.code}`],
                        );
                        return (
                          <span
                            key={locale.code}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              hasTranslation
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {locale.label}
                          </span>
                        );
                      })}
                    </div>
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
                    {item.slug_pl ? <div>{item.slug_pl}</div> : null}
                    {item.slug_ro ? <div>{item.slug_ro}</div> : null}
                    {item.slug_hu ? <div>{item.slug_hu}</div> : null}
                    {item.slug_en ? <div>{item.slug_en}</div> : null}
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
