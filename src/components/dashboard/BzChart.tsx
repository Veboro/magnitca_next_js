import { useMagData } from "@/hooks/useSpaceWeather";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, ReferenceLine } from "recharts";

const toKyivTime = (utc: string) => {
  const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
  return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="font-mono text-xs text-muted-foreground">{label} Київ</p>
      <p className="font-mono text-sm text-primary">Bz: {payload[0]?.value} нТ</p>
    </div>
  );
};

export const BzChart = ({ className }: { className?: string }) => {
  const { data: rawData, isLoading } = useMagData();

  const chartData = (rawData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toKyivTime(d.time_tag),
      bz: d.bz,
    }));

  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Компонент IMF Bz — 2 год
      </h3>
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
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">
        Вертикальна складова міжпланетного магнітного поля (нТ). Від'ємні значення (південний напрямок) підсилюють геомагнітні бурі.
      </p>
    </div>
  );
};
