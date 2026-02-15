import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  slug: string | null;
  published_at: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const News = () => {
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, published_at")
        .order("published_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 300000,
  });

  return (
    <main className="min-h-screen bg-background pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            На головну
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono">
            Останні новини
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Щоденні прогнози та аналітика магнітних бур
          </p>
        </div>

        {/* News list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-card p-4 animate-pulse"
              >
                <div className="h-4 bg-muted/30 rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted/20 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-muted-foreground">Новин поки немає</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {news.map((item, index) => (
              <Link
                key={item.id}
                to={`/news/${item.slug || item.id}`}
                className={cn(
                  "flex items-center justify-between gap-4 py-4 px-2 -mx-2 rounded-md transition-colors hover:bg-muted/30 group",
                  index === 0 && "font-semibold"
                )}
              >
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(item.published_at)}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            Дані оновлюються автоматично на основі прогнозів{" "}
            <a
              href="https://www.swpc.noaa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              NOAA SWPC
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default News;
