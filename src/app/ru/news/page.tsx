import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getLatestNews } from "@/lib/server-news";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("news", "/news", "ru");
}

export const revalidate = 300;

export default async function RussianNewsPage() {
  const news = await getLatestNews(30, "ru").catch(() => []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Новости магнитных бурь</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Ежедневные материалы о магнитных бурях, геомагнитной активности, прогнозах NOAA и влиянии
          космической погоды на самочувствие.
        </p>
      </div>

      <div className="mt-8 divide-y divide-border/40 rounded-3xl border border-border/50 bg-card shadow-sm">
        {news.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Новости пока не загружены.</div>
        ) : (
          news.map((item) => (
            <Link key={item.id} href={`/ru/news/${item.slug || item.id}`} className="block p-6 transition hover:bg-muted/20">
              <h2 className="text-lg font-semibold leading-7 text-foreground">{item.title}</h2>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {new Date(item.published_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {item.description ? (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
