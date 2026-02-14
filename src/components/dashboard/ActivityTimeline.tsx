import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/useSpaceWeather";

const getSeverity = (msg: string): "info" | "warning" | "critical" => {
  const lower = msg.toLowerCase();
  if (lower.includes("warning") || lower.includes("watch")) return "critical";
  if (lower.includes("alert") || lower.includes("summary")) return "warning";
  return "info";
};

const severityStyles = {
  info: "border-primary/40 bg-primary/5",
  warning: "border-accent/40 bg-accent/5",
  critical: "border-destructive/40 bg-destructive/5",
};

const dotStyles = {
  info: "bg-primary",
  warning: "bg-accent animate-pulse-glow",
  critical: "bg-destructive animate-pulse-glow",
};

export const ActivityTimeline = ({ className }: { className?: string }) => {
  const { data: alerts, isLoading } = useAlerts();

  return (
    <div className={cn("rounded-lg border border-glow-cyan bg-card p-6", className)}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Останні сповіщення
      </h3>
      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse-glow">Завантаження...</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
          {(alerts || []).map((alert, i) => {
            const severity = getSeverity(alert.product_id);
            const firstLine = alert.message.split("\n").find((l) => l.trim().length > 10) || alert.product_id;
            const time = alert.issue_datetime?.slice(0, 19).replace("T", " ") || "";
            return (
              <div
                key={i}
                className={cn(
                  "rounded-md border p-3 transition-colors hover:bg-secondary/50",
                  severityStyles[severity]
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", dotStyles[severity])} />
                  <span className="font-mono text-[11px] text-muted-foreground">{time} UTC</span>
                </div>
                <p className="mt-1 ml-4 text-xs text-muted-foreground line-clamp-2">{firstLine.trim()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
