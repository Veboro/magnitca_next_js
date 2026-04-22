import { AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNoaaScales, useKpIndex, type KpEntry, type NoaaScales } from "@/hooks/useSpaceWeather";
import { useKpForecast, type KpForecastEntry } from "@/hooks/useKpForecast";

const getEffectiveLevel = (gLevel: number, kp: number): number => {
  const kpLevel = kp < 4 ? 0 : kp < 5 ? 1 : kp < 6 ? 2 : kp < 7 ? 3 : kp < 8 ? 4 : 5;
  return Math.max(gLevel, kpLevel);
};

const levelColors: Record<number, string> = {
  0: "hsl(145, 80%, 45%)",
  1: "hsl(55, 90%, 50%)",
  2: "hsl(35, 100%, 55%)",
  3: "hsl(15, 90%, 50%)",
  4: "hsl(0, 80%, 55%)",
  5: "hsl(0, 80%, 55%)",
};

interface StormStatusBannerProps {
  initialKp?: KpEntry[] | null;
  initialScales?: NoaaScales | null;
  initialForecast?: KpForecastEntry[] | null;
}

export const StormStatusBanner = ({ initialKp, initialScales, initialForecast }: StormStatusBannerProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : i18n.language === "pl" ? "pl-PL" : "uk-UA";
  const { data: scales } = useNoaaScales(initialScales ?? undefined);
  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: forecast = [] } = useKpForecast(initialForecast ?? undefined);

  const gLevel = scales?.g?.Scale ?? 0;
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const effectiveLevel = getEffectiveLevel(gLevel, latestKp);
  const color = levelColors[effectiveLevel] || levelColors[0];

  const levelLabel = t(`storm.level${effectiveLevel}`);
  const levelDesc = t(`storm.desc${effectiveLevel}`);

  const now = new Date();
  const kyivDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }));
  const todayStr = `${kyivDate.getFullYear()}-${String(kyivDate.getMonth() + 1).padStart(2, "0")}-${String(kyivDate.getDate()).padStart(2, "0")}`;

  const todayAndNext = forecast.filter((e) => {
    const tag = e.time_tag.slice(0, 10);
    const t2 = new Date(e.time_tag);
    return tag === todayStr || (t2 >= now && t2 <= new Date(now.getTime() + 24 * 60 * 60 * 1000));
  });
  const todayEntries = forecast.filter((e) => e.time_tag.slice(0, 10) === todayStr);
  const heroBg = "/hero-bg.jpg";
  const ukraineOutline = i18n.language === "pl" ? undefined : "/ukraine-outline.png";

  return (
    <div className="relative overflow-hidden rounded-lg border border-glow-cyan">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />
      {ukraineOutline && (
        <div className="absolute inset-0 bg-contain bg-no-repeat bg-right-bottom opacity-15 mix-blend-screen" style={{ backgroundImage: `url(${ukraineOutline})` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {effectiveLevel > 0 ? t("storm.geoStorm") : t("storm.monitoring")}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">{levelLabel}</h2>
            <p className="max-w-md text-sm text-muted-foreground">{levelDesc}</p>
          </div>
          <div
            className="hidden md:flex flex-col items-center justify-center rounded-full border border-primary/20 w-24 h-24 ml-6 flex-shrink-0 transition-colors duration-700"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, boxShadow: `0 0 20px ${color}20` }}
          >
            <AlertTriangle className="h-6 w-6 transition-colors duration-700" style={{ color }} />
            <p className="font-mono text-xs font-bold text-foreground mt-1">
              {effectiveLevel > 0 ? t("storm.active") : t("storm.normal")}
            </p>
            <p className="text-[10px] text-muted-foreground">R{scales?.r?.Scale ?? 0} S{scales?.s?.Scale ?? 0} G{gLevel}</p>
          </div>
        </div>

        <div className="rounded-md border border-border/40 bg-background/40 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("storm.todayForecast")}</p>
          {todayEntries.length > 0 && (
            <div className="flex items-end gap-1 mt-1 h-16">
              {todayEntries.map((entry, i) => {
                const hour = new Date(entry.time_tag).toLocaleString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
                const entryColor = levelColors[getEffectiveLevel(0, entry.kp)] || levelColors[0];
                const barHeight = Math.max(10, (entry.kp / 9) * 100);
                const isPast = new Date(entry.time_tag) < now;
                return (
                  <div key={i} className={`flex flex-col items-center flex-1 gap-0.5 ${isPast ? "opacity-50" : ""}`}>
                    <span className="text-[9px] font-mono font-medium" style={{ color: entryColor }}>{entry.kp.toFixed(1)}</span>
                    <div className="w-full rounded-sm bg-muted/30 overflow-hidden" style={{ height: "40px" }}>
                      <div className="w-full rounded-sm transition-all duration-300" style={{ height: `${barHeight}%`, backgroundColor: entryColor, marginTop: "auto" }} />
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground">{hour}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <a
          href="https://t.me/+7UKzAK5ur8UxZmMy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          {t("storm.telegramCta")}
        </a>
      </div>
    </div>
  );
};
