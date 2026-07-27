import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NewsItem { id: string; title: string; slug: string | null; published_at: string; }

export const NewsWidget = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const isRussian = i18n.language.startsWith("ru");
  const isPolish = i18n.language.startsWith("pl");
  const isRomanian = i18n.language.startsWith("ro");
  const isHungarian = i18n.language.startsWith("hu");
  const isBulgarian = i18n.language.startsWith("bg");
  const isCzech = i18n.language.startsWith("cs");
  const isEnglish = i18n.language.startsWith("en");
  const locale = isRussian ? "ru-RU" : isPolish ? "pl-PL" : isRomanian ? "ro-MD" : isHungarian ? "hu-HU" : isBulgarian ? "bg-BG" : isCzech ? "cs-CZ" : isEnglish ? "en-US" : "uk-UA";
  const langPrefix = isRussian ? "/ru" : isPolish ? "/pl" : isRomanian ? "/ro" : isHungarian ? "/hu" : isBulgarian ? "/bg" : isCzech ? "/cs" : isEnglish ? "/en" : "";

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(locale, { day: "numeric", month: "short" });

  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news-widget", i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title_uk, slug_uk, title_ru, slug_ru, title_pl, slug_pl, title_ro, slug_ro, title_hu, slug_hu, title_bg, slug_bg, title_cs, slug_cs, title_en, slug_en, published_at")
        .eq("status", "published")
        .neq("source", "telegram_ai")
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? [])
        .map((item) => ({
          id: item.id,
          title: isRussian ? item.title_ru : isPolish ? item.title_pl : isRomanian ? item.title_ro : isHungarian ? item.title_hu : isBulgarian ? item.title_bg : isCzech ? item.title_cs : isEnglish ? item.title_en : item.title_uk,
          slug: isRussian ? item.slug_ru : isPolish ? item.slug_pl : isRomanian ? item.slug_ro : isHungarian ? item.slug_hu : isBulgarian ? item.slug_bg : isCzech ? item.slug_cs : isEnglish ? item.slug_en : item.slug_uk,
          published_at: item.published_at,
        }))
        .filter((item) => item.title && item.slug) as NewsItem[];
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
        <Link href={`${langPrefix}/news`} className="text-xs text-primary hover:text-primary/80 transition-colors">{t("newsWidget.allNews")}</Link>
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
            <Link key={item.id} href={`${langPrefix}/news/${item.slug || item.id}`} className="flex items-center justify-between gap-2 py-2 -mx-2 px-2 rounded-md hover:bg-muted/30 transition-colors group">
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
