import { cn } from "@/lib/utils";

interface Event {
  time: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

const events: Event[] = [
  { time: "22:14 UTC", title: "X2.1 Solar Flare", description: "Major flare detected from AR 3842. CME expected.", severity: "critical" },
  { time: "19:30 UTC", title: "Kp Index Rising", description: "Geomagnetic activity increasing. Kp now at 6.", severity: "warning" },
  { time: "16:45 UTC", title: "CME Impact", description: "Coronal mass ejection arrived at L1. Solar wind surge detected.", severity: "critical" },
  { time: "12:00 UTC", title: "Proton Event", description: "S1 minor solar radiation storm in progress.", severity: "warning" },
  { time: "08:22 UTC", title: "Active Region Update", description: "Sunspot AR 3842 shows beta-gamma-delta configuration.", severity: "info" },
  { time: "04:10 UTC", title: "Aurora Alert", description: "Aurora visible at mid-latitudes. G2 storm conditions.", severity: "warning" },
];

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
  return (
    <div className={cn("rounded-lg border border-glow-cyan bg-card p-6", className)}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Recent Activity
      </h3>
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
        {events.map((event, i) => (
          <div
            key={i}
            className={cn(
              "rounded-md border p-3 transition-colors hover:bg-secondary/50",
              severityStyles[event.severity]
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", dotStyles[event.severity])} />
              <span className="font-mono text-[11px] text-muted-foreground">{event.time}</span>
              <span className="text-sm font-semibold text-foreground">{event.title}</span>
            </div>
            <p className="mt-1 ml-4 text-xs text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
