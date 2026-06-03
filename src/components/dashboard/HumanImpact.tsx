import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useKpIndex, type KpEntry } from "@/hooks/useSpaceWeather";
import { useKpForecast, type KpForecastEntry } from "@/hooks/useKpForecast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";

const impactBars = [
  { key: "energy", values: [92, 85, 68, 48, 30] },
  { key: "focus", values: [95, 88, 74, 56, 38] },
  { key: "comfort", values: [96, 90, 76, 58, 40] },
];

const overallImpactValues = [5, 10, 24, 45, 63];

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
  };

  const lang = language.startsWith("ru")
    ? "ru"
    : language.startsWith("pl")
      ? "pl"
      : language.startsWith("ro")
        ? "ro"
        : language.startsWith("hu")
          ? "hu"
          : "uk";

  return labels[lang][key] ?? labels.uk[key];
};

const getStormBodyImpactLabel = (language: string) => {
  if (language.startsWith("ru")) return "Влияние бури на организм";
  if (language.startsWith("pl")) return "Wpływ burzy na organizm";
  if (language.startsWith("ro")) return "Impactul furtunii asupra organismului";
  if (language.startsWith("hu")) return "A vihar hatása a szervezetre";
  return "Вплив бурі на організм";
};

const getProgressColor = (value: number) => {
  if (value >= 80) return "hsl(145, 78%, 45%)";
  if (value >= 65) return "hsl(70, 88%, 45%)";
  if (value >= 50) return "hsl(42, 96%, 52%)";
  if (value >= 35) return "hsl(24, 94%, 55%)";
  return "hsl(0, 78%, 56%)";
};

const getImpactRiskColor = (value: number) => {
  if (value < 20) return "hsl(145, 78%, 45%)";
  if (value < 40) return "hsl(42, 96%, 52%)";
  if (value < 60) return "hsl(24, 94%, 55%)";
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
  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: forecast } = useKpForecast(initialForecast ?? undefined);
  const { user } = useAuth();
  const langPrefix = i18n.language.startsWith("ru")
    ? "/ru"
    : i18n.language.startsWith("pl")
      ? "/pl"
      : i18n.language.startsWith("ro")
        ? "/ro"
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

  const hasTestResult = !!user && !!latestResult;
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;

  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
  const todayMaxKp = forecast?.length
    ? Math.max(...forecast.filter((e) => {
        const d = new Date(e.time_tag.includes("Z") ? e.time_tag : e.time_tag + "Z");
        return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" }) === todayKey;
      }).map((e) => e.kp), 0)
    : 0;

  // Keep the wellbeing block aligned with the visible Kp story on the page.
  // Otherwise a stale or broader G-scale can overstate the impact versus the actual daily Kp forecast.
  const finalKp = Math.max(latestKp, todayMaxKp);

  const impactIdx = getImpactLevel(finalKp);
  const overallImpact = overallImpactValues[impactIdx];
  const overallImpactColor = getImpactRiskColor(overallImpact);

  return (
    <div className={cn("official-impact-panel rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("impact.title")}</h3>

      <div>
        <div className="grid gap-4 rounded-md border border-white/15 bg-white/5 p-4 sm:grid-cols-[120px_1fr]">
          <div className="flex items-center gap-3 sm:flex-col sm:items-start">
            <div className="relative h-28 w-4 overflow-hidden rounded-full bg-white/15 sm:h-32">
              <div
                className="absolute bottom-0 left-0 w-full rounded-full transition-all duration-700"
                style={{ height: `${overallImpact}%`, backgroundColor: overallImpactColor }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {getStormBodyImpactLabel(i18n.language)}
              </p>
              <p className="font-mono text-lg font-bold text-foreground">{overallImpact}%</p>
            </div>
          </div>

          <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t("impact.meteoLevel")}</p>
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

      <div className="mt-3 border-t border-border/30 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("impact.meteoLevel")}</span>
        </div>
        {hasTestResult ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("font-mono text-sm font-bold",
                latestResult.score <= 30 ? "text-green-400" : latestResult.score <= 60 ? "text-yellow-400" : latestResult.score <= 80 ? "text-orange-400" : "text-red-400"
              )}>{latestResult.score}%</span>
              <span className="text-[11px] text-muted-foreground">
                {latestResult.score <= 30 ? t("impact.low") : latestResult.score <= 60 ? t("impact.moderate") : latestResult.score <= 80 ? t("impact.high") : t("impact.veryHigh")}
              </span>
            </div>
            <a href={`${langPrefix}/test`} className="text-[10px] text-primary hover:text-primary/80 transition-colors underline underline-offset-2">{t("impact.retakeTest")}</a>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{t("impact.findOut")}</p>
            <a href={`${langPrefix}/test`} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">{t("impact.takeTest")}</a>
          </div>
        )}
      </div>
    </div>
  );
};
