import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useKpIndex } from "@/hooks/useSpaceWeather";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const kpColors = [
  "bg-storm-quiet", "bg-storm-quiet", "bg-storm-quiet",
  "bg-storm-minor", "bg-storm-minor",
  "bg-storm-moderate", "bg-storm-moderate",
  "bg-storm-strong",
  "bg-storm-severe", "bg-storm-severe",
];

export const KpIndexGauge = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const langPrefix = i18n.language === "ru" ? "/ru" : i18n.language === "pl" ? "/pl" : "";
  const { data: kpData } = useKpIndex();
  const latestKp = kpData && kpData.length > 0 ? kpData[kpData.length - 1].kp : 0;
  const value = Math.min(9, Math.max(0, Math.round(latestKp)));
  const kpLabel = t(`gauge.label${value}`);

  return (
    <div className={cn("rounded-lg border border-glow-cyan bg-card p-6", className)} role="img" aria-label={`${t("gauge.title")}. Kp ${value}, ${kpLabel}`}>
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("gauge.title")}</h3>
      <div className="mt-4 flex items-end gap-1.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={cn("w-full rounded-sm transition-all duration-500", i <= value ? kpColors[i] : "bg-secondary", i <= value ? "opacity-100" : "opacity-30")} style={{ height: `${12 + i * 6}px` }} />
            <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full animate-pulse-glow", kpColors[value])} />
          <span className="font-mono text-2xl font-bold text-foreground text-glow-cyan">Kp {value}</span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{kpLabel}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground/60">{t("gauge.note")}</p>
        <Link href={`${langPrefix}/kp-index`} className="inline-flex items-center gap-1 shrink-0 ml-3 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
          {t("gauge.details")} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
