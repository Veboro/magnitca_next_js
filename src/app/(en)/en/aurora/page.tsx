import type { Metadata } from "next";
import { Activity, Cloud, Eye, HelpCircle, Moon, Timer } from "lucide-react";
import { AuroraCountryMap } from "@/components/next/aurora-poland-map";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getEuropeAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Northern Lights in Europe Tonight — Aurora Map & Forecast | Magnitca";
const pageDescription =
  "Northern lights in Europe tonight: where and when to see the aurora — forecast by country, Kp index, cloud cover, Moon illumination and practical viewing conditions on the map.";
const pageUrl = "https://magnitca.com/en/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
      "x-default": pageUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Magnitca",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

const auroraFaqItems = [
  {
    question: "Can I see the northern lights in Europe tonight?",
    answer:
      "It depends on geomagnetic activity, latitude, darkness, cloud cover and light pollution. Northern Europe has the best chance during moderate activity, while central and southern Europe usually need a stronger geomagnetic storm. The map gives an estimated country-level chance for tonight, not a guarantee.",
  },
  {
    question: "What does the percentage on the aurora map mean?",
    answer:
      "The percentage is a practical visibility score for each country. It combines the expected Kp index, the country's latitude, estimated night cloud cover, Moon illumination and the likelihood of seeing a faint glow near the northern horizon. A higher number means conditions are more promising.",
  },
  {
    question: "Which European countries usually have the best chance?",
    answer:
      "Iceland, Norway, Sweden and Finland usually have the strongest natural advantage because they are farther north and closer to the auroral oval. Denmark, the Baltic states, Scotland, northern England, Ireland and Poland can also become good targets during stronger geomagnetic storms.",
  },
  {
    question: "What Kp index is needed to see aurora in Europe?",
    answer:
      "Far northern Europe can see aurora at lower Kp levels, sometimes around Kp 3-4 in good dark locations. Central Europe often needs Kp 6-7 or higher, while southern Europe usually requires a very strong or extreme geomagnetic storm plus clear dark skies.",
  },
  {
    question: "Why can the chance be low when the Kp index is high?",
    answer:
      "Kp is only one part of the picture. Thick clouds, a bright Moon, city lights, haze or a blocked northern horizon can hide weak aurora even during a storm. The forecast therefore reduces the score when sky conditions are poor.",
  },
  {
    question: "Is aurora borealis the same as northern lights and polar lights?",
    answer:
      "Yes. Aurora borealis, northern lights and polar lights are commonly used for the same phenomenon in the Northern Hemisphere: charged particles from the Sun interacting with Earth's magnetic field and upper atmosphere.",
  },
  {
    question: "When is the best time to watch for aurora?",
    answer:
      "The best practical window is the dark part of the night, usually from about 21:00 to 04:00 local time depending on season and country. During an active storm, check the northern sky several times because aurora can appear in waves and fade quickly.",
  },
  {
    question: "How should I choose a viewing location?",
    answer:
      "Go as far from city lights as possible, look for an open northern horizon and avoid street lamps or bright phone screens. Coastlines, lakes, fields and hills can work well. Let your eyes adapt to darkness for at least 10-15 minutes.",
  },
  {
    question: "Why does the camera see aurora better than my eyes?",
    answer:
      "A camera can collect light for several seconds, so a weak red or green glow may look much brighter in photos than it looks to the naked eye. In central Europe, aurora can sometimes appear as a pale arc, faint glow or reddish tint near the horizon.",
  },
  {
    question: "What data does this Europe aurora forecast use?",
    answer:
      "The forecast uses NOAA SWPC data for geomagnetic activity and Kp forecasts, Open-Meteo for estimated night cloud cover, SunCalc for Moon illumination and country borders prepared from open geographic datasets. The score is recalculated regularly so the map is not a static mockup.",
  },
  {
    question: "How often does the aurora map update?",
    answer:
      "The page recalculates approximately every 15 minutes. The source datasets have their own update intervals, so the map can change through the evening as new Kp and weather data become available.",
  },
  {
    question: "Is the Europe aurora forecast a guarantee?",
    answer:
      "No forecast can guarantee visible aurora. Treat the map as a decision helper: it shows where conditions look more favorable tonight, but the final result depends on fast-changing space weather and the sky above your location.",
  },
];

function formatAuroraDate(dateIso: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateIso));
}

function formatCloudCondition(value: number | null) {
  if (value === null) return "night cloud cover that is still being refined";
  if (value <= 25) return `low night cloud cover around ${value}%`;
  if (value <= 60) return `moderate night cloud cover around ${value}%`;
  return `high night cloud cover around ${value}%`;
}

function formatMoonCondition(value: number) {
  if (value <= 25) return `the Moon should not interfere much (${value}% illumination)`;
  if (value <= 65) return `the Moon may slightly reduce contrast (${value}% illumination)`;
  return `a bright Moon may make faint aurora harder to see (${value}% illumination)`;
}

function getAuroraChanceColor(value: number) {
  if (value >= 75) return "hsl(16 92% 53%)";
  if (value >= 58) return "hsl(34 96% 52%)";
  if (value >= 38) return "hsl(48 94% 52%)";
  if (value >= 18) return "hsl(145 64% 46%)";
  return "hsl(204 72% 38%)";
}

export default async function EnglishEuropeAuroraPage() {
  const forecast = await getEuropeAuroraForecast();
  const averageNightCloud = forecast.averageNightCloud;
  const forecastDate = formatAuroraDate(forecast.updatedAt);
  const cloudCondition = formatCloudCondition(averageNightCloud);
  const moonCondition = formatMoonCondition(forecast.moonIllumination);
  const auroraChanceColor = getAuroraChanceColor(forecast.topChance);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: auroraFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="official-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="official-page-shell aurora-page-shell space-y-8">
        <header className="official-page-header space-y-3 p-3 sm:p-4">
          <nav className="official-page-breadcrumb text-sm" aria-label="Breadcrumb">
            <a href="/en" className="text-primary hover:text-primary/80">Magnitca</a>
            <span>/</span>
            <span>Aurora forecast Europe</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Eye className="h-4 w-4" />
                Aurora watch Europe
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Northern lights in Europe
              </h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground">
                Northern lights in Europe tonight, {forecastDate}: this live map shows where the
                aurora or polar lights may be visible by country. The
                aurora borealis forecast combines the expected Kp index up to {forecast.effectiveKp},
                current geomagnetic activity, country latitude, a dark northern horizon,
                {` ${cloudCondition}`} and Moon phase: {moonCondition}.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(43_92%_92%)_58%,hsl(var(--card))_100%)] p-4 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">Chance to see aurora:</p>
                <span className="rounded-full bg-[#183966] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">today</span>
              </div>
              <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_120px] items-end gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold leading-tight text-foreground">{forecast.summaryLabel}</p>
                </div>
                <div className="relative h-[76px] w-[120px] rounded-xl border border-border/40 bg-card/75 px-1 pt-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]" aria-label={`Chance to see northern or polar lights ${forecast.topChance}%`}>
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 120 76" role="img" aria-hidden="true">
                    <path
                      d="M15 65 A45 45 0 0 1 105 65"
                      fill="none"
                      pathLength={100}
                      stroke="hsl(43 32% 82%)"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                    <path
                      d="M15 65 A45 45 0 0 1 105 65"
                      fill="none"
                      pathLength={100}
                      stroke={auroraChanceColor}
                      strokeDasharray={`${forecast.topChance} 100`}
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 text-center">
                    <p className="font-mono text-2xl font-bold" style={{ color: auroraChanceColor }}>{forecast.topChance}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">tonight</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="grid gap-4 px-3 sm:px-4 lg:grid-cols-4">
          {[
            { icon: Activity, label: "Activity", value: `Kp ${forecast.effectiveKp}`, hint: `current Kp ${forecast.currentKp}` },
            {
              icon: Cloud,
              label: "Clouds",
              value: averageNightCloud === null ? "-" : `${averageNightCloud}%`,
              hint: "average night estimate",
            },
            {
              icon: Moon,
              label: "Moon",
              value: `${forecast.moonIllumination}%`,
              hint: forecast.moonIllumination >= 70 ? "bright night" : forecast.moonIllumination >= 35 ? "moderate moonlight" : "darker night",
            },
            { icon: Timer, label: "Window", value: "21:00-04:00", hint: "local night forecast window" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</span>
              </div>
              <p className="font-mono text-2xl font-bold text-foreground">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4">
          <AuroraCountryMap
            boundariesUrl="/geo/europe-countries.geojson"
            center={[54, 15]}
            zoom={4}
            minZoom={3}
            maxZoom={7}
            regions={forecast.regions}
            labels={{
              legend: "Chance to see northern or polar lights",
              chance: "Chance",
              boundariesError: "Unable to load European country borders.",
            }}
            legend={[
              { label: "very high", tone: "veryHigh" },
              { label: "high", tone: "high" },
              { label: "moderate", tone: "medium" },
              { label: "low", tone: "low" },
              { label: "almost none", tone: "none" },
            ]}
            regionLinks={{
              UA: { href: "/aurora", label: "Open Ukraine forecast" },
              PL: { href: "/pl/aurora", label: "Otwórz prognozę dla Polski" },
              HU: { href: "/hu/aurora", label: "Magyarországi előrejelzés" },
              RO: { href: "/ro/aurora-romania", label: "Deschide prognoza pentru România" },
              MD: { href: "/ro/aurora-moldova", label: "Deschide prognoza pentru Moldova" },
            }}
          />
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4" aria-label="Europe aurora forecast FAQ">
          <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_0_24px_rgba(34,211,238,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">FAQ</p>
            </div>
            <div className="mb-6 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Northern lights forecast for Europe: FAQ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Practical answers about reading the map, choosing a country or viewing spot,
                and understanding why aurora forecasts are useful guidance rather than a promise.
              </p>
            </div>

            <div className="space-y-4">
              {auroraFaqItems.map((item) => (
                <details key={item.question} className="group rounded-xl border border-border/30 bg-background/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground sm:text-base">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">v</span>
                  </summary>
                  <p className="aurora-faq-answer px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
