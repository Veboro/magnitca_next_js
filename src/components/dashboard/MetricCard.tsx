import { cn } from "@/lib/utils";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "quiet" | "minor" | "moderate" | "strong" | "severe";
  className?: string;
  tooltip?: string;
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
  tooltip,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card p-5 transition-all hover:scale-[1.02]",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {tooltip && (
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="inline-flex" aria-label={`Інформація про ${title}`}>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 hover:text-primary cursor-help transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="max-w-[220px] text-xs p-2">
                  {tooltip}
                </PopoverContent>
              </Popover>
            )}
          </div>
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
