import { useSolarWind } from "@/hooks/useSpaceWeather";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 font-mono text-xs text-muted-foreground">{label} UTC</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {entry.name === "Швидкість" ? "км/с" : "p/см³"}
        </p>
      ))}
    </div>
  );
};

export const SolarWindChart = ({ className }: { className?: string }) => {
  const { data: rawData, isLoading } = useSolarWind();

  const chartData = (rawData || [])
    .filter((_, i) => i % 3 === 0) // thin out for readability
    .map((d) => ({
      time: d.time_tag.slice(11, 16),
      speed: d.speed,
      density: d.density,
    }));

  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`}>
      <div className="mb-4 flex items-center gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Сонячний вітер — 2 год
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3 w-3 text-muted-foreground/50 hover:text-primary cursor-help transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-xs">
            Графік швидкості (км/с) та густини (p/см³) сонячного вітру за останні 2 години. Різке зростання швидкості може спровокувати геомагнітну бурю.
          </TooltipContent>
        </Tooltip>
      </div>
      {isLoading ? (
        <div className="flex h-[240px] items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse-glow">Завантаження...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(200, 40%, 18%, 0.8)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="speed" name="Швидкість" stroke="hsl(180, 100%, 50%)" fill="url(#speedGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="density" name="Густ." stroke="hsl(35, 100%, 55%)" fill="url(#densityGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
