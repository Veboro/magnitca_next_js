import { Wind, Gauge, Radio, Sun, Activity, Thermometer } from "lucide-react";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { SolarWindChart } from "@/components/dashboard/SolarWindChart";
import { BzChart } from "@/components/dashboard/BzChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary animate-pulse-glow" />
            <h1 className="font-display text-xl font-bold text-foreground">
              Magnetic<span className="text-primary">Storm</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
              <span className="font-mono text-xs text-muted-foreground">LIVE</span>
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {new Date().toUTCString().slice(0, -4)} UTC
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <StormStatusBanner />

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard icon={Gauge} title="Kp Index" value={6} status="moderate" trendValue="Rising" trend="up" />
          <MetricCard icon={Wind} title="Solar Wind" value={650} unit="km/s" status="strong" trendValue="High speed" trend="up" />
          <MetricCard icon={Radio} title="Bz (IMF)" value={-15.3} unit="nT" status="moderate" trendValue="Southward" trend="down" />
          <MetricCard icon={Sun} title="Proton Flux" value={120} unit="pfu" status="minor" trendValue="S1 Storm" trend="up" />
          <MetricCard icon={Thermometer} title="Bt (IMF)" value={22.4} unit="nT" status="moderate" trendValue="Elevated" trend="up" />
          <MetricCard icon={Activity} title="Dst Index" value={-87} unit="nT" status="moderate" trendValue="Depressed" trend="down" />
        </div>

        {/* Kp Index + Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <KpIndexGauge value={6} className="lg:col-span-1" />
          <SolarWindChart className="lg:col-span-2" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <BzChart className="lg:col-span-2" />
          <ActivityTimeline className="lg:col-span-1" />
        </div>
      </main>
    </div>
  );
};

export default Index;
