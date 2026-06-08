"use client";

import { useEffect } from "react";
import { HeartPulse } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { STORM_FEELING_STATS_EVENT } from "@/components/dashboard/StormFeelingPoll";
import type { SiteLocale } from "@/lib/locale";

type StormFeelingStats = {
  date: string;
  total: number;
  yes: number;
  no: number;
  yesPercent: number;
  noPercent: number;
};

const STORM_FEELING_QUERY_KEY = ["storm-feeling-stats"] as const;

const copy: Record<SiteLocale, { empty: string; feel: string; responses: string }> = {
  uk: {
    empty: "Перші відповіді ще збираються",
    feel: "Відчувають {{percent}}% опитаних",
    responses: "{{count}} відповідей",
  },
  ru: {
    empty: "Первые ответы ещё собираются",
    feel: "Чувствуют {{percent}}% опрошенных",
    responses: "{{count}} ответов",
  },
  pl: {
    empty: "Pierwsze odpowiedzi sa jeszcze zbierane",
    feel: "Czuje {{percent}}% ankietowanych",
    responses: "{{count}} odpowiedzi",
  },
  ro: {
    empty: "Primele răspunsuri se adună",
    feel: "Simt {{percent}}% dintre respondenți",
    responses: "{{count}} răspunsuri",
  },
  hu: {
    empty: "Az első válaszok még gyűlnek",
    feel: "A válaszadók {{percent}}%-a érzi",
    responses: "{{count}} válasz",
  },
  en: {
    empty: "The first answers are still being collected",
    feel: "{{percent}}% of respondents feel it",
    responses: "{{count}} responses",
  },
};

function formatTemplate(template: string, values: Record<string, number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
}

function getPollColor(value: number) {
  if (value >= 70) return "hsl(0, 78%, 56%)";
  if (value >= 45) return "hsl(24, 94%, 55%)";
  if (value >= 25) return "hsl(42, 96%, 52%)";
  return "hsl(145, 78%, 45%)";
}

export function CityStormFeelingSummary({
  locale,
  className,
}: {
  locale: SiteLocale;
  className?: string;
}) {
  const t = copy[locale] ?? copy.uk;
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({
    queryKey: STORM_FEELING_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/storm-feelings");
      if (!response.ok) {
        throw new Error("Unable to load storm feeling stats");
      }
      return (await response.json()) as StormFeelingStats;
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: 1,
  });

  useEffect(() => {
    const handleStatsUpdate = (event: Event) => {
      const nextStats = (event as CustomEvent<StormFeelingStats>).detail;
      if (nextStats) {
        queryClient.setQueryData(STORM_FEELING_QUERY_KEY, nextStats);
      }
    };

    window.addEventListener(STORM_FEELING_STATS_EVENT, handleStatsUpdate);
    return () => window.removeEventListener(STORM_FEELING_STATS_EVENT, handleStatsUpdate);
  }, [queryClient]);

  const total = stats?.total ?? 0;
  const percent = stats?.yesPercent ?? 0;
  const color = getPollColor(percent);
  const label = total > 0 ? formatTemplate(t.feel, { percent }) : t.empty;
  const responses = formatTemplate(t.responses, { count: total });

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <HeartPulse className="h-4 w-4 shrink-0 text-primary" />
          <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-foreground">{label}</p>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">{responses}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted/30">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${total > 0 ? percent : 8}%`,
            backgroundColor: total > 0 ? color : "hsl(0 0% 100% / 0.25)",
          }}
        />
      </div>
    </div>
  );
}
