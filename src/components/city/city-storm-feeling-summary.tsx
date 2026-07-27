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
  better?: number;
  neutral?: number;
  worse?: number;
  yesPercent: number;
  noPercent: number;
};

const STORM_FEELING_QUERY_KEY = ["storm-feeling-stats"] as const;

const copy: Record<
  SiteLocale,
  {
    empty: string;
    discomfort: string;
    responses: string;
    better: string;
    neutral: string;
    worse: string;
  }
> = {
  uk: {
    empty: "Перші відповіді ще збираються",
    discomfort: "Дискомфорт відчувають {{percent}}%",
    responses: "{{count}} відповідей",
    better: "Добре {{percent}}%",
    neutral: "Нейтрально {{percent}}%",
    worse: "Погано {{percent}}%",
  },
  ru: {
    empty: "Первые ответы ещё собираются",
    discomfort: "Дискомфорт чувствуют {{percent}}%",
    responses: "{{count}} ответов",
    better: "Хорошо {{percent}}%",
    neutral: "Нейтрально {{percent}}%",
    worse: "Плохо {{percent}}%",
  },
  pl: {
    empty: "Pierwsze odpowiedzi sa jeszcze zbierane",
    discomfort: "Dyskomfort czuje {{percent}}%",
    responses: "{{count}} odpowiedzi",
    better: "Dobrze {{percent}}%",
    neutral: "Neutralnie {{percent}}%",
    worse: "Zle {{percent}}%",
  },
  ro: {
    empty: "Primele răspunsuri se adună",
    discomfort: "Disconfort simt {{percent}}%",
    responses: "{{count}} răspunsuri",
    better: "Bine {{percent}}%",
    neutral: "Neutru {{percent}}%",
    worse: "Rău {{percent}}%",
  },
  hu: {
    empty: "Az első válaszok még gyűlnek",
    discomfort: "Kellemetlenséget érez {{percent}}%",
    responses: "{{count}} válasz",
    better: "Jól {{percent}}%",
    neutral: "Semleges {{percent}}%",
    worse: "Rosszul {{percent}}%",
  },
  bg: {
    empty: "Първите отговори още се събират",
    discomfort: "Дискомфорт усещат {{percent}}%",
    responses: "{{count}} отговора",
    better: "Добре {{percent}}%",
    neutral: "Неутрално {{percent}}%",
    worse: "Зле {{percent}}%",
  },
  cs: {
    empty: "První odpovědi se teprve sbírají",
    discomfort: "Nepohodu cítí {{percent}}%",
    responses: "{{count}} odpovědí",
    better: "Dobře {{percent}}%",
    neutral: "Neutrálně {{percent}}%",
    worse: "Špatně {{percent}}%",
  },
  en: {
    empty: "The first answers are still being collected",
    discomfort: "{{percent}}% feel discomfort",
    responses: "{{count}} responses",
    better: "Good {{percent}}%",
    neutral: "Neutral {{percent}}%",
    worse: "Bad {{percent}}%",
  },
};

function formatTemplate(template: string, values: Record<string, number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
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
  const discomfortPercent = stats?.yesPercent ?? 0;
  const betterPercent = total > 0 ? Math.round(((stats?.better ?? 0) / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round(((stats?.neutral ?? 0) / total) * 100) : 0;
  const worsePercent = total > 0 ? Math.max(0, 100 - betterPercent - neutralPercent) : 0;
  const label = total > 0 ? formatTemplate(t.discomfort, { percent: discomfortPercent }) : t.empty;
  const responses = formatTemplate(t.responses, { count: total });

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <HeartPulse className="h-4 w-4 shrink-0 text-primary" />
          <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-foreground">{label}</p>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">{responses}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted/40">
        {total > 0 ? (
          <div className="flex h-full w-full">
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${betterPercent}%`, backgroundColor: "hsl(145, 78%, 45%)" }}
            />
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${neutralPercent}%`, backgroundColor: "hsl(42, 96%, 52%)" }}
            />
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${worsePercent}%`, backgroundColor: "hsl(0, 78%, 56%)" }}
            />
          </div>
        ) : (
          <div className="h-full w-[8%] rounded-full bg-muted-foreground/25" />
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        <span className="mood-label-good">{formatTemplate(t.better, { percent: betterPercent })}</span>
        <span className="mood-label-neutral text-center">{formatTemplate(t.neutral, { percent: neutralPercent })}</span>
        <span className="mood-label-bad text-right">{formatTemplate(t.worse, { percent: worsePercent })}</span>
      </div>
    </div>
  );
}
