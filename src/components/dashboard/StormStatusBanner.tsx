import { AlertTriangle, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const StormStatusBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-glow-cyan">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative flex items-center justify-between p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent animate-pulse-glow" />
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              Geomagnetic Storm in Progress
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground text-glow-cyan">
            G2 — Moderate Storm
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            NOAA SWPC has issued a G2 geomagnetic storm watch. Aurora may be visible at latitudes 55° and above. Possible power grid fluctuations at high latitudes.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
          <AlertTriangle className="h-8 w-8 text-accent" />
          <div>
            <p className="font-mono text-lg font-bold text-accent text-glow-amber">ACTIVE</p>
            <p className="text-xs text-muted-foreground">Storm Level G2</p>
          </div>
        </div>
      </div>
    </div>
  );
};
