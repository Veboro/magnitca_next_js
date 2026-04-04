import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Brain, Frown, Smile, Meh, Activity } from "lucide-react";

const moodIcons = [Smile, Smile, Meh, Frown, Frown];
const levelColors = [
  "hsl(145, 80%, 45%)",
  "hsl(55, 90%, 50%)",
  "hsl(35, 100%, 55%)",
  "hsl(15, 90%, 50%)",
  "hsl(0, 80%, 55%)",
];
const pulseSpeeds = ["6s", "5s", "4s", "3s", "2s"];

const symptomKeys: string[][] = [
  [],
  ["symptomFatigue"],
  ["symptomHeadache", "symptomIrritability", "symptomSleep"],
  ["symptomMigraine", "symptomTachycardia", "symptomAnxiety", "symptomMoodSwings"],
  ["symptomSevereHeadache", "symptomArrhythmia", "symptomInsomnia", "symptomDizziness", "symptomAnxietyShort"],
];

const getImpactLevel = (kp: number): number => {
  if (kp <= 2) return 0;
  if (kp <= 3) return 1;
  if (kp <= 5) return 2;
  if (kp <= 7) return 3;
  return 4;
};

export const HumanImpact = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();
  const { data: forecast } = useKpForecast();
  const { user } = useAuth();
  const langPrefix = i18n.language === "ru" ? "/ru" : "";

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
  const gLevel = scales?.g?.Scale ?? 0;

  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
  const todayMaxKp = forecast?.length
    ? Math.max(...forecast.filter((e) => {
        const d = new Date(e.time_tag.includes("Z") ? e.time_tag : e.time_tag + "Z");
        return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" }) === todayKey;
      }).map((e) => e.kp), 0)
    : 0;

  const effectiveKp = Math.max(latestKp, todayMaxKp);
  const gBasedKp = gLevel > 0 ? gLevel + 4 : 0;
  const finalKp = Math.max(effectiveKp, gBasedKp);

  const impactIdx = getImpactLevel(finalKp);
  const color = levelColors[impactIdx];
  const pulseSpeed = pulseSpeeds[impactIdx];
  const MoodIcon = moodIcons[impactIdx];
  const label = t(`impact.level${impactIdx}label`);
  const description = t(`impact.level${impactIdx}desc`);
  const symptoms = symptomKeys[impactIdx].map((k) => t(`impact.${k}`));

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("impact.title")}</h3>

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="80" height="150" viewBox="0 0 140 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-1000">
            <defs>
              <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={color} stopOpacity="0.4">
                  <animate attributeName="stopOpacity" values="0.2;0.5;0.2" dur={pulseSpeed} repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <ellipse cx="70" cy="120" rx="65" ry="120" fill="url(#bodyGlow)" />
            <circle cx="70" cy="35" r="22" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" filter="url(#glow)" className="transition-all duration-1000">
              <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur={pulseSpeed} repeatCount="indefinite" />
            </circle>
            <line x1="70" y1="57" x2="70" y2="72" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M 70 72 L 70 160" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" className="transition-all duration-1000" />
            <path d="M 70 82 L 30 100 L 20 145" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 70 82 L 110 100 L 120 145" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 70 160 L 45 245" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 70 160 L 95 245" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            {impactIdx >= 2 && (
              <circle cx="65" cy="100" r="6" fill={color} fillOpacity="0.3" filter="url(#glow)">
                <animate attributeName="r" values="4;8;4" dur={pulseSpeed} repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.2;0.5;0.2" dur={pulseSpeed} repeatCount="indefinite" />
              </circle>
            )}
            {impactIdx >= 3 && (
              <circle cx="70" cy="30" r="8" fill={color} fillOpacity="0.3" filter="url(#glow)">
                <animate attributeName="r" values="6;12;6" dur={pulseSpeed} repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.15;0.4;0.15" dur={pulseSpeed} repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <MoodIcon className="h-4 w-4 transition-colors duration-1000" style={{ color }} />
              <span className="font-display text-base font-bold transition-colors duration-1000" style={{ color }}>{label}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((s) => {
                const hslMatch = color.match(/hsl\(([^)]+)\)/);
                const hslValues = hslMatch ? hslMatch[1] : "0, 0%, 50%";
                return (
                  <span key={s} className="rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-500"
                    style={{ borderColor: `hsla(${hslValues}, 0.2)`, color, backgroundColor: `hsla(${hslValues}, 0.1)` }}>
                    {s}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">
                Kp {latestKp.toFixed(1)}{todayMaxKp > latestKp ? ` / ${t("common.max")} ${todayMaxKp.toFixed(1)}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">G{gLevel}</span>
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
            <a href={`${langPrefix}/test`} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 font-mono text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">{t("impact.takeTest")}</a>
          </div>
        )}
      </div>
    </div>
  );
};
