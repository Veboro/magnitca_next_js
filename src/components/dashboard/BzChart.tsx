import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

const data = [
  { time: "00:00", bz: 2.1 },
  { time: "02:00", bz: -1.3 },
  { time: "04:00", bz: -5.8 },
  { time: "06:00", bz: -12.4 },
  { time: "08:00", bz: -18.2 },
  { time: "10:00", bz: -14.1 },
  { time: "12:00", bz: -8.6 },
  { time: "14:00", bz: -15.3 },
  { time: "16:00", bz: -22.7 },
  { time: "18:00", bz: -16.1 },
  { time: "20:00", bz: -9.5 },
  { time: "22:00", bz: -6.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="font-mono text-xs text-muted-foreground">{label} UTC</p>
      <p className="font-mono text-sm text-primary">Bz: {payload[0]?.value} nT</p>
    </div>
  );
};

export const BzChart = ({ className }: { className?: string }) => {
  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        IMF Bz Component — 24h
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(200, 40%, 18%, 0.8)" />
          <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="hsl(215, 20%, 35%)" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="bz" stroke="hsl(180, 100%, 50%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
