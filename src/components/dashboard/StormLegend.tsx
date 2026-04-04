const levels = [
  { kp: "0–1", label: "Спокійно", color: "bg-storm-quiet" },
  { kp: "2–3", label: "Слабка активність", color: "bg-storm-minor" },
  { kp: "4", label: "Помірна активність", color: "bg-yellow-500" },
  { kp: "5", g: "G1", label: "Слабка буря", color: "bg-orange-500" },
  { kp: "6", g: "G2", label: "Помірна буря", color: "bg-orange-600" },
  { kp: "7", g: "G3", label: "Сильна буря", color: "bg-storm-strong" },
  { kp: "8", g: "G4", label: "Дуже сильна буря", color: "bg-red-700" },
  { kp: "9", g: "G5", label: "Екстремальна буря", color: "bg-storm-severe" },
];

export const StormLegend = () => (
  <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-4">
    <h3 className="text-sm font-semibold text-foreground/90 mb-3">Шкала магнітних бур (Kp / G-рівень)</h3>
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {levels.map((l) => (
        <div key={l.kp} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`h-2.5 w-2.5 rounded-full ${l.color} shrink-0`} />
          <span className="font-mono font-medium text-foreground/80">Kp {l.kp}</span>
          {l.g && <span className="font-mono text-muted-foreground/70">({l.g})</span>}
          <span>— {l.label}</span>
        </div>
      ))}
    </div>
  </div>
);
