import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NewsItem { id: string; title: string; slug: string | null; published_at: string; }

export const NewsWidget = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : "uk-UA";
  const langPrefix = i18n.language === "ru" ? "/ru" : "";

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(locale, { day: "numeric", month: "short" });

  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news-widget"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("id, title, slug, published_at").eq("telegram_sent", false).order("published_at", { ascending: false }).limit(4);
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
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("newsWidget.title")}</h3>
        </div>
        <Link to={`${langPrefix}/news`} className="text-xs text-primary hover:text-primary/80 transition-colors">{t("newsWidget.allNews")}</Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (<div key={i} className="animate-pulse"><div className="h-3.5 bg-muted/30 rounded w-3/4 mb-1.5" /><div className="h-2.5 bg-muted/20 rounded w-1/4" /></div>))}
        </div>
      ) : news.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("newsWidget.noNews")}</p>
      ) : (
        <div className="space-y-1">
          {news.map((item) => (
            <Link key={item.id} to={`${langPrefix}/news/${item.slug || item.id}`} className="flex items-center justify-between gap-2 py-2 -mx-2 px-2 rounded-md hover:bg-muted/30 transition-colors group">
              <div className="min-w-0">
                <p className="text-sm leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                <span className="text-[11px] text-muted-foreground/60 font-mono">{formatDate(item.published_at)}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
