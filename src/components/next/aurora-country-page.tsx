import { Activity, Cloud, Eye, HelpCircle, Moon, Timer } from "lucide-react";
import { AuroraCountryMap, type AuroraCountryMapProps } from "@/components/next/aurora-poland-map";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { AuroraForecastResult } from "@/lib/aurora-forecast";

type AuroraFaqItem = {
  question: string;
  answer: string;
};

type AuroraCountryPageProps = {
  forecast: AuroraForecastResult;
  homeHref: string;
  homeLabel: string;
  breadcrumbLabel: string;
  badge: string;
  title: string;
  intro: string;
  chanceLabel: string;
  todayLabel: string;
  tonightLabel: string;
  metrics: {
    activity: string;
    currentKp: string;
    clouds: string;
    cloudHint: string;
    moon: string;
    moonHints: {
      bright: string;
      moderate: string;
      dark: string;
    };
    window: string;
    windowValue: string;
    windowHint: string;
  };
  map: AuroraCountryMapProps;
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    items: AuroraFaqItem[];
  };
};

function getAuroraChanceColor(value: number) {
  if (value >= 75) return "hsl(16 92% 53%)";
  if (value >= 58) return "hsl(34 96% 52%)";
  if (value >= 38) return "hsl(48 94% 52%)";
  if (value >= 18) return "hsl(145 64% 46%)";
  return "hsl(204 72% 38%)";
}

export function AuroraCountryPage({
  forecast,
  homeHref,
  homeLabel,
  breadcrumbLabel,
  badge,
  title,
  intro,
  chanceLabel,
  todayLabel,
  tonightLabel,
  metrics,
  map,
  faq,
}: AuroraCountryPageProps) {
  const averageNightCloud = forecast.averageNightCloud;
  const auroraChanceColor = getAuroraChanceColor(forecast.topChance);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
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
            <a href={homeHref} className="text-primary hover:text-primary/80">{homeLabel}</a>
            <span>/</span>
            <span>{breadcrumbLabel}</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Eye className="h-4 w-4" />
                {badge}
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground">
                {intro}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(43_92%_92%)_58%,hsl(var(--card))_100%)] p-4 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">{chanceLabel}</p>
                <span className="rounded-full bg-[#183966] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">{todayLabel}</span>
              </div>
              <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_120px] items-end gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold leading-tight text-foreground">{forecast.summaryLabel}</p>
                </div>
                <div className="relative h-[76px] w-[120px] rounded-xl border border-border/40 bg-card/75 px-1 pt-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]" aria-label={`${chanceLabel} ${forecast.topChance}%`}>
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{tonightLabel}</p>
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
            { icon: Activity, label: metrics.activity, value: `Kp ${forecast.effectiveKp}`, hint: `${metrics.currentKp} ${forecast.currentKp}` },
            {
              icon: Cloud,
              label: metrics.clouds,
              value: averageNightCloud === null ? "—" : `${averageNightCloud}%`,
              hint: metrics.cloudHint,
            },
            {
              icon: Moon,
              label: metrics.moon,
              value: `${forecast.moonIllumination}%`,
              hint: forecast.moonIllumination >= 70
                ? metrics.moonHints.bright
                : forecast.moonIllumination >= 35
                  ? metrics.moonHints.moderate
                  : metrics.moonHints.dark,
            },
            { icon: Timer, label: metrics.window, value: metrics.windowValue, hint: metrics.windowHint },
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
          <AuroraCountryMap {...map} />
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4" aria-label={faq.title}>
          <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_0_24px_rgba(34,211,238,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{faq.eyebrow}</span>
            </div>
            <div className="mb-6 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{faq.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{faq.intro}</p>
            </div>
            <div className="space-y-4">
              {faq.items.map((item) => (
                <details key={item.question} className="group rounded-xl border border-border/50 bg-background/35 open:bg-background/55">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left font-display text-base font-bold text-foreground">
                    {item.question}
                    <span className="text-primary transition group-open:rotate-180">⌄</span>
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
