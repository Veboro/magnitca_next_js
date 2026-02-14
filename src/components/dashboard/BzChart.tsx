import { useMagData } from "@/hooks/useSpaceWeather";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="font-mono text-xs text-muted-foreground">{label} UTC</p>
      <p className="font-mono text-sm text-primary">Bz: {payload[0]?.value} нТ</p>
    </div>
  );
};

export const BzChart = ({ className }: { className?: string }) => {
  const { data: rawData, isLoading } = useMagData();

  const chartData = (rawData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: d.time_tag.slice(11, 16),
      bz: d.bz,
    }));

  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`}>
      <div className="mb-4 flex items-center gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Компонент IMF Bz — 2 год
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3 w-3 text-muted-foreground/50 hover:text-primary cursor-help transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-xs">
            Вертикальна складова міжпланетного магнітного поля (нТ). Від'ємні значення (нижче 0) означають південний напрямок — це підсилює геомагнітні бурі.
          </TooltipContent>
        </Tooltip>
      </div>
      {isLoading ? (
        <div className="flex h-[240px] items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse-glow">Завантаження...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(200, 40%, 18%, 0.8)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="hsl(215, 20%, 35%)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="bz" stroke="hsl(180, 100%, 50%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
