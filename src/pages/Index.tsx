import { Wind, Gauge, Radio, Sun, Activity, Thermometer } from "lucide-react";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { SolarWindChart } from "@/components/dashboard/SolarWindChart";
import { BzChart } from "@/components/dashboard/BzChart";
import { ForecastCard } from "@/components/dashboard/ForecastCard";
import { HumanImpact } from "@/components/dashboard/HumanImpact";
import { useKpIndex, useSolarWind, useMagData, useNoaaScales } from "@/hooks/useSpaceWeather";

const getKpStatus = (kp: number) => {
  if (kp <= 2) return "quiet" as const;
  if (kp <= 3) return "minor" as const;
  if (kp <= 5) return "moderate" as const;
  if (kp <= 7) return "strong" as const;
  return "severe" as const;
};

const Index = () => {
  const { data: kpData } = useKpIndex();
  const { data: windData } = useSolarWind();
  const { data: magData } = useMagData();
  const { data: scales } = useNoaaScales();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;
  const gLevel = scales?.g?.Scale ?? 0;

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <StormStatusBanner />
          <HumanImpact />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard icon={Gauge} title="Kp Індекс" value={Math.round(latestKp)} status={getKpStatus(latestKp)} trendValue={latestKp > 4 ? "Зростає" : "Стабільно"} trend="stable" tooltip="Планетарний індекс магнітної активності (0–9). Значення ≥5 означає геомагнітну бурю." />
          <MetricCard icon={Wind} title="Сон. вітер" value={Math.round(latestWind?.speed || 0)} unit="км/с" status={latestWind && latestWind.speed > 500 ? "strong" : "quiet"} trendValue={latestWind && latestWind.speed > 500 ? "Висока шв." : "Нормальна"} trend="stable" tooltip="Швидкість потоку заряджених частинок від Сонця. Норма ~400 км/с, >500 км/с — підвищена активність." />
          <MetricCard icon={Radio} title="Bz (IMF)" value={latestMag?.bz?.toFixed(1) || "—"} unit="нТ" status={latestMag && latestMag.bz < -10 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bz < 0 ? "Південний" : "Північний"} trend="stable" tooltip="Вертикальна складова міжпланетного магнітного поля. Від'ємні значення (південний напрямок) посилюють геомагнітні бурі." />
          <MetricCard icon={Sun} title="R-шкала" value={`R${scales?.r?.Scale ?? 0}`} status={scales && scales.r.Scale > 2 ? "strong" : "quiet"} trendValue="Радіо" trend="stable" tooltip="Шкала NOAA для радіозатемнень (R1–R5). Впливає на HF-радіозв'язок та GPS-навігацію." />
          <MetricCard icon={Thermometer} title="Bt (IMF)" value={latestMag?.bt?.toFixed(1) || "—"} unit="нТ" status={latestMag && latestMag.bt > 15 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bt > 15 ? "Підвищений" : "Нормальний"} trend="stable" tooltip="Загальна напруженість міжпланетного магнітного поля. Значення >15 нТ вказує на потужний сонячний вітер." />
          <MetricCard icon={Activity} title="G-шкала" value={`G${gLevel}`} status={gLevel > 2 ? "strong" : gLevel > 0 ? "moderate" : "quiet"} trendValue={gLevel > 0 ? "Буря" : "Спокійно"} trend="stable" tooltip="Шкала NOAA для геомагнітних бур (G1–G5). Впливає на енергомережі, супутники та полярне сяйво." />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <KpIndexGauge className="lg:col-span-1" />
          <SolarWindChart className="lg:col-span-2" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <BzChart className="lg:col-span-2" />
          <ForecastCard className="lg:col-span-1" />
        </div>
      </main>
    </div>
  );
};

export default Index;
