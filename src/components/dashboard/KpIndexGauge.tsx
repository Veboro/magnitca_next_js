import { cn } from "@/lib/utils";

interface KpIndexGaugeProps {
  value: number; // 0-9
  className?: string;
}

const kpLabels = ["Quiet", "Quiet", "Low", "Unsettled", "Active", "Minor Storm", "Moderate", "Strong", "Severe", "Extreme"];
const kpColors = [
  "bg-storm-quiet",
  "bg-storm-quiet",
  "bg-storm-quiet",
  "bg-storm-minor",
  "bg-storm-minor",
  "bg-storm-moderate",
  "bg-storm-moderate",
  "bg-storm-strong",
  "bg-storm-severe",
  "bg-storm-severe",
];

export const KpIndexGauge = ({ value, className }: KpIndexGaugeProps) => {
  return (
    <div className={cn("rounded-lg border border-glow-cyan bg-card p-6", className)}>
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Planetary Kp Index
      </h3>
      <div className="mt-4 flex items-end gap-1.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                "w-full rounded-sm transition-all duration-500",
                i <= value ? kpColors[i] : "bg-secondary",
                i <= value ? "opacity-100" : "opacity-30"
              )}
              style={{ height: `${12 + i * 6}px` }}
            />
            <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full animate-pulse-glow", kpColors[value])} />
          <span className="font-mono text-2xl font-bold text-foreground text-glow-cyan">
            Kp {value}
          </span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{kpLabels[value]}</span>
      </div>
    </div>
  );
};
