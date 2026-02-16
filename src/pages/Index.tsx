import { Wind, Gauge, Radio, Sun, Activity, Thermometer } from "lucide-react";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { SolarWindChart } from "@/components/dashboard/SolarWindChart";
import { BzChart } from "@/components/dashboard/BzChart";
import { ForecastCard } from "@/components/dashboard/ForecastCard";
import { Forecast27Day } from "@/components/dashboard/Forecast27Day";
import { HumanImpact } from "@/components/dashboard/HumanImpact";
import { NewsWidget } from "@/components/dashboard/NewsWidget";
import { MeteoSensitivityWidget } from "@/components/dashboard/MeteoSensitivityWidget";
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
      <main className="mx-auto max-w-7xl space-y-6 p-6" role="main">
        <h1 className="sr-only">Магнітка — моніторинг магнітних бур в реальному часі</h1>

        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">Прогноз на сьогодні</h2>
          <span className="font-mono text-sm text-muted-foreground">
            {new Date().toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
          </span>
        </div>
        <section aria-label="Статус геомагнітної активності">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
            <StormStatusBanner />
            <HumanImpact />
            <MeteoSensitivityWidget className="lg:w-52" />
          </div>
        </section>

        <section aria-label="Ключові показники космічної погоди">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard icon={Gauge} title="Kp Індекс" value={Math.round(latestKp)} status={getKpStatus(latestKp)} trendValue={latestKp > 4 ? "Зростає" : "Стабільно"} trend="stable" tooltip="Планетарний індекс магнітної активності (0–9). Значення ≥5 означає геомагнітну бурю." />
            <MetricCard icon={Wind} title="Сон. вітер" value={Math.round(latestWind?.speed || 0)} unit="км/с" status={latestWind && latestWind.speed > 500 ? "strong" : "quiet"} trendValue={latestWind && latestWind.speed > 500 ? "Висока шв." : "Нормальна"} trend="stable" tooltip="Швидкість потоку заряджених частинок від Сонця. Норма ~400 км/с, >500 км/с — підвищена активність." />
            <MetricCard icon={Radio} title="Bz (IMF)" value={latestMag?.bz?.toFixed(1) || "—"} unit="нТ" status={latestMag && latestMag.bz < -10 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bz < 0 ? "Південний" : "Північний"} trend="stable" tooltip="Вертикальна складова міжпланетного магнітного поля. Від'ємні значення (південний напрямок) посилюють геомагнітні бурі." />
            <MetricCard icon={Sun} title="R-шкала" value={`R${scales?.r?.Scale ?? 0}`} status={scales && scales.r.Scale > 2 ? "strong" : "quiet"} trendValue="Радіо" trend="stable" tooltip="Шкала NOAA для радіозатемнень (R1–R5). Впливає на HF-радіозв'язок та GPS-навігацію." />
            <MetricCard icon={Thermometer} title="Bt (IMF)" value={latestMag?.bt?.toFixed(1) || "—"} unit="нТ" status={latestMag && latestMag.bt > 15 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bt > 15 ? "Підвищений" : "Нормальний"} trend="stable" tooltip="Загальна напруженість міжпланетного магнітного поля. Значення >15 нТ вказує на потужний сонячний вітер." />
            <MetricCard icon={Activity} title="G-шкала" value={`G${gLevel}`} status={gLevel > 2 ? "strong" : gLevel > 0 ? "moderate" : "quiet"} trendValue={gLevel > 0 ? "Буря" : "Спокійно"} trend="stable" tooltip="Шкала NOAA для геомагнітних бур (G1–G5). Впливає на енергомережі, супутники та полярне сяйво." />
          </div>
        </section>

        <section aria-label="Прогноз на 3 дні">
          <ForecastCard layout="horizontal" />
        </section>

        <section aria-label="Розширений прогноз на 27 днів">
          <Forecast27Day />
        </section>

        <section aria-label="Графіки та прогноз">
          <div className="grid gap-6 lg:grid-cols-3">
            <KpIndexGauge className="lg:col-span-1" />
            <SolarWindChart className="lg:col-span-2" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <BzChart className="lg:col-span-2" />
            <NewsWidget className="lg:col-span-1" />
          </div>
        </section>
      </main>

      <section className="mx-auto max-w-7xl px-6 py-10" aria-label="Про сервіс Магнітка">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Магнітні бурі сьогодні, {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })} — прогноз геомагнітної активності
          </h2>
          <p>
            <strong>Магнітка</strong> — це безкоштовний український сервіс моніторингу магнітних бур у реальному часі. Ми показуємо актуальний <strong>Kp індекс</strong>, швидкість сонячного вітру, стан міжпланетного магнітного поля та прогноз геомагнітної активності на сьогодні й найближчі три дні. Усі дані оновлюються щохвилини з офіційних джерел <strong>NOAA Space Weather Prediction Center</strong>.
          </p>
          <p>
            Геомагнітні бурі виникають через потужні викиди сонячної плазми, що взаємодіють із магнітним полем Землі. Вони можуть впливати на самопочуття людей — спричиняти головний біль, підвищену втомлюваність, перепади тиску та порушення сну. Завдяки Магнітці ви завжди знатимете, чи очікується магнітна буря сьогодні, і зможете підготуватися заздалегідь.
          </p>
          <p>
            Сервіс відображає ключові показники космічної погоди: <strong>Kp індекс</strong> (планетарний індекс магнітної активності від 0 до 9), <strong>G-шкалу NOAA</strong> (рівень геомагнітної бурі від G1 до G5), а також графіки сонячного вітру та компоненти Bz магнітного поля. Додатково доступний <strong>календар магнітних бур</strong> з архівом за останні дні та прогнозом на наступні.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Index;
