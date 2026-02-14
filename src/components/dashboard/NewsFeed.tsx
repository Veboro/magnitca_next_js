import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/useSpaceWeather";
import { Newspaper, ExternalLink } from "lucide-react";

const getSeverity = (msg: string): "info" | "warning" | "critical" => {
  const lower = msg.toLowerCase();
  if (lower.includes("warning") || lower.includes("watch")) return "critical";
  if (lower.includes("alert") || lower.includes("summary")) return "warning";
  return "info";
};

const severityLabels = {
  info: "Інформація",
  warning: "Увага",
  critical: "Попередження",
};

const severityDot = {
  info: "bg-primary",
  warning: "bg-accent",
  critical: "bg-destructive animate-pulse-glow",
};

const severityBorder = {
  info: "border-primary/20",
  warning: "border-accent/20",
  critical: "border-destructive/20",
};

export const NewsFeed = ({ className }: { className?: string }) => {
  const { data: alerts, isLoading } = useAlerts();

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Новини космічної погоди
          </h3>
        </div>
        <a
          href="https://www.swpc.noaa.gov/communities/space-weather-enthusiasts"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          NOAA SWPC <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-md bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(alerts || []).slice(0, 6).map((alert, i) => {
            const severity = getSeverity(alert.product_id);
            const lines = alert.message.split("\n").filter((l) => l.trim().length > 10);
            const title = lines[0]?.trim() || alert.product_id;
            const summary = lines.slice(1, 3).join(" ").trim().slice(0, 120);
            const time = alert.issue_datetime?.slice(0, 16).replace("T", " ") || "";

            return (
              <article
                key={i}
                className={cn(
                  "group rounded-md border p-3 transition-all hover:bg-secondary/30 cursor-pointer",
                  severityBorder[severity]
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", severityDot[severity])} />
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    {severityLabels[severity]}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50 ml-auto">
                    {time} UTC
                  </span>
                </div>
                <h4 className="text-sm font-medium text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {title}
                </h4>
                {summary && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{summary}</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
