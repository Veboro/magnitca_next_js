import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { time: "00:00", speed: 380, density: 4.2 },
  { time: "02:00", speed: 395, density: 5.1 },
  { time: "04:00", speed: 420, density: 6.8 },
  { time: "06:00", speed: 510, density: 12.4 },
  { time: "08:00", speed: 580, density: 18.2 },
  { time: "10:00", speed: 620, density: 22.1 },
  { time: "12:00", speed: 590, density: 15.6 },
  { time: "14:00", speed: 650, density: 19.3 },
  { time: "16:00", speed: 710, density: 24.7 },
  { time: "18:00", speed: 680, density: 20.1 },
  { time: "20:00", speed: 630, density: 16.5 },
  { time: "22:00", speed: 605, density: 14.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 font-mono text-xs text-muted-foreground">{label} UTC</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {entry.name === "Speed" ? "km/s" : "p/cm³"}
        </p>
      ))}
    </div>
  );
};

export const SolarWindChart = ({ className }: { className?: string }) => {
  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Solar Wind — 24h
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
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
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="speed" name="Speed" stroke="hsl(180, 100%, 50%)" fill="url(#speedGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="density" name="Density" stroke="hsl(35, 100%, 55%)" fill="url(#densityGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
