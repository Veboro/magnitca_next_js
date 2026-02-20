import { Wind, Gauge, Radio, Sun, Activity, Thermometer, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
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
  const REFRESH_INTERVAL = 60;
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  usePageMeta(
    "Магнітка — магнітні бурі сьогодні, прогноз Kp індексу",
    "Магнітка — моніторинг магнітних бур в реальному часі. Kp індекс, сонячний вітер, прогноз геомагнітної активності та вплив на здоров'я. Дані NOAA щохвилини."
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">Поточна ситуація</h2>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
            <span className="font-mono text-xs text-muted-foreground">НАЖИВО</span>
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {new Date().toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <RefreshCw
              className="h-3 w-3 text-muted-foreground/60 transition-transform"
              style={{
                animation: countdown <= 3 ? "spin 1s linear infinite" : "none",
              }}
            />
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {countdown}с
            </span>
            <span
              className="h-[3px] rounded-full bg-primary/40 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / REFRESH_INTERVAL) * 40}px` }}
            />
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

      <section className="mx-auto max-w-7xl px-6 py-10" aria-label="Магнітні бурі по містах України">
        <h2 className="text-lg font-display font-semibold text-foreground/90 mb-4">
          Магнітні бурі по містах України
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {[
            { name: "Вінниця", slug: "vinnytsia" },
            { name: "Дніпро", slug: "dnipro" },
            { name: "Донецьк", slug: "donetsk" },
            { name: "Житомир", slug: "zhytomyr" },
            { name: "Запоріжжя", slug: "zaporizhzhia" },
            { name: "Івано-Франківськ", slug: "ivano-frankivsk" },
            { name: "Київ", slug: "kyiv", active: true },
            { name: "Кропивницький", slug: "kropyvnytskyi" },
            { name: "Луганськ", slug: "luhansk" },
            { name: "Львів", slug: "lviv" },
            { name: "Луцьк", slug: "lutsk" },
            { name: "Миколаїв", slug: "mykolaiv" },
            { name: "Одеса", slug: "odesa" },
            { name: "Полтава", slug: "poltava" },
            { name: "Рівне", slug: "rivne" },
            { name: "Севастополь", slug: "sevastopol" },
            { name: "Сімферополь", slug: "simferopol" },
            { name: "Суми", slug: "sumy" },
            { name: "Тернопіль", slug: "ternopil" },
            { name: "Ужгород", slug: "uzhhorod" },
            { name: "Харків", slug: "kharkiv" },
            { name: "Херсон", slug: "kherson" },
            { name: "Хмельницький", slug: "khmelnytskyi" },
            { name: "Черкаси", slug: "cherkasy" },
            { name: "Чернівці", slug: "chernivtsi" },
            { name: "Чернігів", slug: "chernihiv" },
          ].map((city) => (
            city.active ? (
              <a
                key={city.slug}
                href={`/city/${city.slug}`}
                className="text-primary hover:underline whitespace-nowrap"
              >
                магнітні бурі <span className="font-semibold">{city.name}</span>
              </a>
            ) : (
              <span
                key={city.slug}
                className="text-muted-foreground/60 whitespace-nowrap cursor-default"
              >
                магнітні бурі <span className="font-semibold">{city.name}</span>
              </span>
            )
          ))}
        </div>
      </section>

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
