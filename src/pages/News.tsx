import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  published_at: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });
};

const News = () => {
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(20);
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
            Новини космічної погоди
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Щоденні прогнози та аналітика магнітних бур для України
          </p>
        </div>

        {/* News list */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-card p-6 animate-pulse"
              >
                <div className="h-5 bg-muted/30 rounded w-3/4 mb-4" />
                <div className="h-3 bg-muted/20 rounded w-1/4 mb-6" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted/20 rounded w-full" />
                  <div className="h-3 bg-muted/20 rounded w-full" />
                  <div className="h-3 bg-muted/20 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-muted-foreground">Новин поки немає</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item, index) => (
              <article
                key={item.id}
                className={cn(
                  "rounded-lg border border-border/50 bg-card p-6 sm:p-8 transition-colors hover:border-primary/30",
                  index === 0 && "border-primary/20 shadow-[var(--glow-cyan)]"
                )}
              >
                <header className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold leading-tight mb-3">
                    {item.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(item.published_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(item.published_at)}
                    </span>
                    {item.source === "ai" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Автоматичний прогноз
                      </span>
                    )}
                  </div>
                </header>
                <div className="prose-sm text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                  {item.content}
                </div>
              </article>
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
