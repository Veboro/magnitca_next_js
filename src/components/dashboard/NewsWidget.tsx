import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, ChevronRight } from "lucide-react";
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
  return d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
};

export const NewsWidget = ({ className }: { className?: string }) => {
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news-widget"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, published_at")
        .order("published_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 300000,
  });

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Новини
          </h3>
        </div>
        <Link
          to="/news"
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Усі новини →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3.5 bg-muted/30 rounded w-3/4 mb-1.5" />
              <div className="h-2.5 bg-muted/20 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <p className="text-sm text-muted-foreground">Новин поки немає</p>
      ) : (
        <div className="space-y-1">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug || item.id}`}
              className="flex items-center justify-between gap-2 py-2 -mx-2 px-2 rounded-md hover:bg-muted/30 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm leading-snug truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <span className="text-[11px] text-muted-foreground/60 font-mono">
                  {formatDate(item.published_at)}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
