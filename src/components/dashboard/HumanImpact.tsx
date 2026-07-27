import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useKpIndex, type KpEntry } from "@/hooks/useSpaceWeather";
import { useKpForecast, type KpForecastEntry } from "@/hooks/useKpForecast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, HeartPulse } from "lucide-react";
import { STORM_FEELING_STATS_EVENT } from "@/components/dashboard/StormFeelingPoll";

const impactBars = [
  { key: "energy", values: [92, 85, 68, 48, 30] },
  { key: "focus", values: [95, 88, 74, 56, 38] },
  { key: "comfort", values: [96, 90, 76, 58, 40] },
];

const STORM_FEELING_QUERY_KEY = ["storm-feeling-stats"] as const;

const getImpactLevel = (kp: number): number => {
  if (kp <= 2) return 0;
  if (kp <= 3) return 1;
  if (kp <= 5) return 2;
  if (kp <= 7) return 3;
  return 4;
};

const getImpactBarLabel = (key: string, language: string) => {
  const labels: Record<string, Record<string, string>> = {
    uk: { energy: "Енергія", focus: "Фокус", comfort: "Комфорт" },
    ru: { energy: "Энергия", focus: "Фокус", comfort: "Комфорт" },
    pl: { energy: "Energia", focus: "Skupienie", comfort: "Komfort" },
    ro: { energy: "Energie", focus: "Focus", comfort: "Confort" },
    hu: { energy: "Energia", focus: "Fókusz", comfort: "Komfort" },
    bg: { energy: "Енергия", focus: "Концентрация", comfort: "Комфорт" },
    en: { energy: "Energy", focus: "Focus", comfort: "Comfort" },
  };

  const lang = language.startsWith("ru")
    ? "ru"
    : language.startsWith("pl")
      ? "pl"
      : language.startsWith("ro")
        ? "ro"
        : language.startsWith("hu")
          ? "hu"
          : language.startsWith("bg")
            ? "bg"
            : language.startsWith("en")
              ? "en"
              : "uk";

  return labels[lang][key] ?? labels.uk[key];
};

const getImpactDateLabel = (language: string) => {
  const locale = language.startsWith("ru")
    ? "ru-RU"
    : language.startsWith("pl")
      ? "pl-PL"
      : language.startsWith("ro")
        ? "ro-RO"
        : language.startsWith("hu")
          ? "hu-HU"
          : language.startsWith("bg")
            ? "bg-BG"
            : language.startsWith("en")
              ? "en-US"
              : "uk-UA";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Kyiv",
  }).format(new Date());
};

type StormFeelingStats = {
  date: string;
  total: number;
  yes: number;
  no: number;
  better: number;
  neutral: number;
  worse: number;
  scoreCounts?: Array<{
    score: number;
    count: number;
    percent: number;
  }>;
  timeline?: Array<{
    label: string;
    total: number;
    averageScore: number;
    worsePercent: number;
  }>;
  yesPercent: number;
  noPercent: number;
  averageScore?: number;
};

const getImpactRiskColor = (value: number) => {
  if (value < 20) return "hsl(145, 78%, 45%)";
  if (value < 40) return "hsl(42, 96%, 52%)";
  if (value < 60) return "hsl(24, 94%, 55%)";
  return "hsl(0, 78%, 56%)";
};

const getProgressColor = (value: number) => {
  if (value >= 80) return "hsl(145, 78%, 45%)";
  if (value >= 65) return "hsl(70, 88%, 45%)";
  if (value >= 50) return "hsl(42, 96%, 52%)";
  if (value >= 35) return "hsl(24, 94%, 55%)";
  return "hsl(0, 78%, 56%)";
};

export const HumanImpact = ({
  className,
  initialKp,
  initialForecast,
}: {
  className?: string;
  initialKp?: KpEntry[] | null;
  initialForecast?: KpForecastEntry[] | null;
}) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: forecast } = useKpForecast(initialForecast ?? undefined);
  const { user } = useAuth();
  const langPrefix = i18n.language.startsWith("ru")
    ? "/ru"
    : i18n.language.startsWith("pl")
      ? "/pl"
      : i18n.language.startsWith("ro")
        ? "/ro"
        : i18n.language.startsWith("hu")
          ? "/hu"
          : i18n.language.startsWith("bg")
            ? "/bg"
            : i18n.language.startsWith("en")
              ? "/en"
        : "";

  const { data: latestResult } = useQuery({
    queryKey: ["latest-test-result", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("test_results")
        .select("score, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: stormFeelingStats } = useQuery({
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
      const stats = (event as CustomEvent<StormFeelingStats>).detail;
      if (stats) {
        queryClient.setQueryData(STORM_FEELING_QUERY_KEY, stats);
      }
    };

    window.addEventListener(STORM_FEELING_STATS_EVENT, handleStatsUpdate);
    return () => window.removeEventListener(STORM_FEELING_STATS_EVENT, handleStatsUpdate);
  }, [queryClient]);

  const hasTestResult = !!user && !!latestResult;
  const pollPercent = stormFeelingStats?.yesPercent ?? 0;
  const pollTotal = stormFeelingStats?.total ?? 0;
  const pollColor = getImpactRiskColor(pollPercent);
  const betterPercent = pollTotal > 0 ? Math.round(((stormFeelingStats?.better ?? 0) / pollTotal) * 100) : 0;
  const neutralPercent = pollTotal > 0 ? Math.round(((stormFeelingStats?.neutral ?? 0) / pollTotal) * 100) : 0;
  const worsePercent = pollTotal > 0 ? Math.max(0, 100 - betterPercent - neutralPercent) : 0;
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
  const todayMaxKp = forecast?.length
    ? Math.max(...forecast.filter((e) => {
        const d = new Date(e.time_tag.includes("Z") ? e.time_tag : `${e.time_tag}Z`);
        return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" }) === todayKey;
      }).map((e) => e.kp), 0)
    : 0;
  const finalKp = Math.max(latestKp, todayMaxKp);
  const impactIdx = getImpactLevel(finalKp);
  const impactDate = getImpactDateLabel(i18n.language);

  return (
    <div className={cn("official-impact-panel rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("impact.title")}</h3>

      <div>
        <div className="rounded-md border border-white/15 bg-white/5 p-4">
          <div className="mb-4 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
              <div className="flex min-w-0 items-center gap-2">
                <HeartPulse className="h-3.5 w-3.5 shrink-0" />
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em]">
                  {pollTotal > 0 ? t("feelingPoll.discomfortShare", { percent: pollPercent }) : t("feelingPoll.emptyResult")}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                {t("feelingPoll.responses", { count: pollTotal })}
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/15">
              {pollTotal > 0 ? (
                <div className="flex h-full w-full">
                  <div className="h-full transition-all duration-700" style={{ width: `${betterPercent}%`, backgroundColor: "hsl(145, 78%, 45%)" }} />
                  <div className="h-full transition-all duration-700" style={{ width: `${neutralPercent}%`, backgroundColor: "hsl(42, 96%, 52%)" }} />
                  <div className="h-full transition-all duration-700" style={{ width: `${worsePercent}%`, backgroundColor: pollColor }} />
                </div>
              ) : (
                <div className="h-full w-[8%] rounded-full bg-white/25" />
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              <span className="mood-label-good">{t("feelingPoll.moodBetter", { percent: betterPercent })}</span>
              <span className="mood-label-neutral text-center">{t("feelingPoll.moodNeutral", { percent: neutralPercent })}</span>
              <span className="mood-label-bad text-right">{t("feelingPoll.moodWorse", { percent: worsePercent })}</span>
            </div>
          </div>

          <div>
            <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {t("impact.meteoLevel", { date: impactDate })}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {impactBars.map((item) => {
                const value = item.values[impactIdx];
                const progressColor = getProgressColor(value);
                const circumference = 2 * Math.PI * 28;
                const dashOffset = circumference - (value / 100) * circumference;

                return (
                  <div key={item.key} className="flex flex-col items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-3 text-center">
                    <div className="relative h-20 w-20">
                      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="hsl(0 0% 100% / 0.14)" strokeWidth="7" />
                        <circle
                          cx="36"
                          cy="36"
                          r="28"
                          fill="none"
                          stroke={progressColor}
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          className="impact-progress-ring transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-sm font-bold text-foreground">{value}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{getImpactBarLabel(item.key, i18n.language)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-border/30 pt-4">
        {hasTestResult ? (
          <div className="flex min-h-[54px] items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Activity className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className={cn("font-mono text-sm font-bold",
                latestResult.score <= 30 ? "text-green-400" : latestResult.score <= 60 ? "text-yellow-400" : latestResult.score <= 80 ? "text-orange-400" : "text-red-400"
              )}>{latestResult.score}%</span>
              <span className="text-[11px] text-muted-foreground">
                {latestResult.score <= 30 ? t("impact.low") : latestResult.score <= 60 ? t("impact.moderate") : latestResult.score <= 80 ? t("impact.high") : t("impact.veryHigh")}
              </span>
            </div>
            <a href={`${langPrefix}/test`} className="inline-flex min-h-[42px] min-w-[150px] items-center justify-center rounded-xl bg-background px-5 py-3 font-mono text-sm font-semibold text-primary transition-colors hover:bg-background/90">{t("impact.retakeTest")}</a>
          </div>
        ) : (
          <div className="flex min-h-[54px] items-center justify-between gap-5">
            <p className="flex-1 self-center text-sm font-semibold leading-snug text-muted-foreground">{t("impact.findOut")}</p>
            <a href={`${langPrefix}/test`} className="inline-flex min-h-[42px] min-w-[170px] items-center justify-center self-center rounded-xl bg-background px-6 py-3 font-mono text-sm font-semibold text-primary transition-colors hover:bg-background/90">{t("impact.takeTest")}</a>
          </div>
        )}
      </div>
    </div>
  );
};
