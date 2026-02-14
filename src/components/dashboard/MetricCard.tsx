import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "quiet" | "minor" | "moderate" | "strong" | "severe";
  className?: string;
}

const statusStyles = {
  quiet: "border-storm-quiet/30 glow-green",
  minor: "border-storm-minor/30",
  moderate: "border-storm-moderate/30 glow-amber",
  strong: "border-storm-strong/30",
  severe: "border-storm-severe/30 glow-red",
};

const statusDotStyles = {
  quiet: "bg-storm-quiet",
  minor: "bg-storm-minor",
  moderate: "bg-storm-moderate",
  strong: "bg-storm-strong",
  severe: "bg-storm-severe animate-pulse-glow",
};

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = "quiet",
  className,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-5 transition-all hover:scale-[1.02]",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-bold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
        <div className="rounded-md bg-secondary p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {(trend || trendValue) && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              statusDotStyles[status]
            )}
          />
          <span className="text-xs text-muted-foreground">{trendValue}</span>
        </div>
      )}
    </div>
  );
};
