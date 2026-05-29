import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, HelpCircle, Sunrise, Sunset, SunMedium, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { CityConfig } from "@/data/cities";
import type { SunriseOverviewCity } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type PlSunPageProps = {
  kind: "sunrise" | "sunset";
  mode: "today" | "tomorrow";
  dateLabel: string;
  cities: SunriseOverviewCity[];
  earliestSunrise: SunriseOverviewCity | null;
  latestSunrise: SunriseOverviewCity | null;
  earliestSunset: SunriseOverviewCity | null;
  latestSunset: SunriseOverviewCity | null;
  averageDayLengthLabel: string;
};

function formatNightLength(minutes: number) {
  const nightMinutes = Math.max(0, 24 * 60 - minutes);
  const h = Math.floor(nightMinutes / 60);
  const m = nightMinutes % 60;
  return `${h} godz. ${m} min`;
}

function cityHref(city: CityConfig) {
  return `/pl/city/${city.slug}`;
}

function pathFor(kind: "sunrise" | "sunset", mode: "today" | "tomorrow") {
  return `/pl/${mode === "tomorrow" ? `${kind}-tomorrow` : kind}`;
}

export function PlSunPage({
  kind,
  mode,
  dateLabel,
  cities,
  earliestSunrise,
  latestSunrise,
  earliestSunset,
  latestSunset,
  averageDayLengthLabel,
}: PlSunPageProps) {
  const isSunrise = kind === "sunrise";
  const isTomorrow = mode === "tomorrow";
  const currentPath = pathFor(kind, mode);
  const averageDayLengthMinutes = cities.length
    ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length)
    : 0;
  const averageNightLengthLabel = formatNightLength(averageDayLengthMinutes);
  const primaryEarly = isSunrise ? earliestSunrise : earliestSunset;
  const primaryLate = isSunrise ? latestSunrise : latestSunset;
  const primaryEarlyValue = isSunrise ? primaryEarly?.sunriseLabel : primaryEarly?.sunsetLabel;
  const primaryLateValue = isSunrise ? primaryLate?.sunriseLabel : primaryLate?.sunsetLabel;
  const dayWord = isTomorrow ? "jutro" : "dzisiaj";

  const h1 = isSunrise ? `Wschód słońca w Polsce ${dayWord}` : `Zachód słońca w Polsce ${dayWord}`;
  const tableTitle = isSunrise ? "Wschód i zachód słońca w miastach Polski" : "Zachód, noc i wschód słońca w miastach Polski";
  const seoTitle = isSunrise ? "Jak zmienia się wschód słońca w Polsce" : "Jak zmienia się zachód słońca i długość nocy w Polsce";
  const seoBody = isSunrise
    ? "Godzina wschodu słońca w Polsce zależy od miasta, daty i położenia geograficznego. Na tej stronie porównujemy świt, wschód, południe słoneczne, zachód, zmierzch i długość dnia dla dostępnych miast."
    : "Godzina zachodu słońca w Polsce zmienia się z dnia na dzień i różni się między miastami. Tabela pomaga porównać zachód, zmierzch, długość nocy oraz kolejny wschód słońca.";

  const relatedLinks = isSunrise
    ? [
        { href: pathFor("sunrise", isTomorrow ? "today" : "tomorrow"), label: isTomorrow ? "wschód słońca dzisiaj" : "wschód słońca jutro" },
        { href: pathFor("sunset", "today"), label: "zachód słońca dzisiaj" },
        { href: pathFor("sunset", "tomorrow"), label: "zachód słońca jutro" },
      ]
    : [
        { href: pathFor("sunset", isTomorrow ? "today" : "tomorrow"), label: isTomorrow ? "zachód słońca dzisiaj" : "zachód słońca jutro" },
        { href: pathFor("sunrise", "today"), label: "wschód słońca dzisiaj" },
        { href: pathFor("sunrise", "tomorrow"), label: "wschód słońca jutro" },
      ];

  const faqItems = [
    {
      q: isSunrise ? `O której jest wschód słońca w Polsce ${dayWord}?` : `O której jest zachód słońca w Polsce ${dayWord}?`,
      a: `Dokładna godzina zależy od miasta. Na tej stronie pokazujemy dane dla ${dateLabel}, a w tabeli można sprawdzić wartości dla każdego dostępnego miasta.`,
    },
    {
      q: isSunrise ? "Gdzie jest najwcześniejszy i najpóźniejszy wschód słońca?" : "Gdzie jest najwcześniejszy i najpóźniejszy zachód słońca?",
      a: isSunrise
        ? `Najwcześniejszy wschód jest w ${primaryEarly?.city.name ?? "jednym z miast"} o ${primaryEarlyValue ?? "—"}, a najpóźniejszy w ${primaryLate?.city.name ?? "innym mieście"} o ${primaryLateValue ?? "—"}.`
        : `Najwcześniejszy zachód jest w ${primaryEarly?.city.name ?? "jednym z miast"} o ${primaryEarlyValue ?? "—"}, a najpóźniejszy w ${primaryLate?.city.name ?? "innym mieście"} o ${primaryLateValue ?? "—"}.`,
    },
    {
      q: "Co oznaczają świt, południe słoneczne i zmierzch?",
      a: "Świt to okres światła przed wschodem słońca, południe słoneczne oznacza moment najwyższego położenia słońca na niebie, a zmierzch to naturalne światło po zachodzie.",
    },
    {
      q: isSunrise ? "Jak obliczana jest długość dnia?" : "Jak obliczana jest długość nocy?",
      a: isSunrise
        ? `Długość dnia to czas między wschodem i zachodem słońca. Średnia dla dostępnych miast wynosi około ${averageDayLengthLabel}.`
        : `Długość nocy to przybliżony czas między zachodem i kolejnym wschodem słońca. Średnia dla dostępnych miast wynosi około ${averageNightLengthLabel}.`,
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: absoluteUrl("/pl") },
      { "@type": "ListItem", position: 2, name: h1, item: absoluteUrl(currentPath) },
    ],
  };

  const TimeCell = ({ icon, value, className }: { icon: ReactNode; value: string; className?: string }) => (
    <span className="inline-flex items-center gap-2 font-mono text-foreground">
      <span className={className}>{icon}</span>
      <span>{value}</span>
    </span>
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="space-y-3">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/pl" className="transition-colors hover:text-foreground">Strona główna</Link>
          <span>/</span>
          <span className="text-foreground">{h1}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{h1}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Dane dla {dateLabel}: porównanie miast w Polsce, z godzinami świtu, wschodu, południa
          słonecznego, zachodu, zmierzchu oraz długością dnia lub nocy.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={pathFor(kind, "today")} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "today" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? "Wschód dzisiaj" : "Zachód dzisiaj"}
          </Link>
          <Link href={pathFor(kind, "tomorrow")} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "tomorrow" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? "Wschód jutro" : "Zachód jutro"}
          </Link>
        </div>
      </header>

      <MobileAdsenseSlot />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? "Najwcześniejszy wschód" : "Najwcześniejszy zachód"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryEarlyValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryEarly?.city.name ?? "Dane są aktualizowane"}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? "Najpóźniejszy wschód" : "Najpóźniejszy zachód"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryLateValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryLate?.city.name ?? "Dane są aktualizowane"}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-4 w-4 text-primary" />
            {isSunrise ? "Średnia długość dnia" : "Średnia długość nocy"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{isSunrise ? averageDayLengthLabel : averageNightLengthLabel}</p>
            <p className="text-sm text-muted-foreground">Na podstawie dostępnych miast</p>
          </div>
        </div>
      </section>

      <MobileAdsenseSlot />

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{tableTitle}</h2>
        </div>
        <div className="grid gap-4 md:hidden">
          {cities.map((item) => (
            <article key={item.city.slug} className="rounded-xl border border-border/40 bg-background/40 p-4">
              <Link href={cityHref(item.city)} className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary">
                {item.city.name}
                <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Świt</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} className="text-amber-300" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Wschód</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} className="text-primary" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Zachód</p>
                  <div className="mt-2"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} className="text-orange-400" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{isSunrise ? "Długość dnia" : "Długość nocy"}</p>
                  <p className="mt-2 font-mono text-foreground">{isSunrise ? item.dayLength : formatNightLength(item.dayLengthMinutes)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[920px] w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-3 py-3">Miasto</th>
                <th className="px-3 py-3">Świt</th>
                <th className="px-3 py-3">Wschód</th>
                <th className="px-3 py-3">Południe słoneczne</th>
                <th className="px-3 py-3">Zachód</th>
                <th className="px-3 py-3">Zmierzch</th>
                <th className="px-3 py-3">{isSunrise ? "Długość dnia" : "Długość nocy"}</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((item) => (
                <tr key={item.city.slug} className="border-b border-border/20 last:border-0">
                  <td className="px-3 py-3">
                    <Link href={cityHref(item.city)} className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary">
                      {item.city.name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
                    </Link>
                  </td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} className="text-amber-300" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} className="text-primary" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<SunMedium className="h-3.5 w-3.5" />} value={item.solarNoonLabel} className="text-yellow-400" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} className="text-orange-400" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.duskLabel} className="text-indigo-300" /></td>
                  <td className="px-3 py-3 text-muted-foreground">{isSunrise ? item.dayLength : formatNightLength(item.dayLengthMinutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">{seoTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{seoBody}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Warto też sprawdzić:{" "}
          {relatedLinks.map((item, index) => (
            <span key={item.href}>
              <Link href={item.href} className="text-primary transition-colors hover:text-primary/80 hover:underline">{item.label}</Link>
              {index < relatedLinks.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Najczęstsze pytania</h2>
        </div>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border/30 bg-background/40">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground">
                {item.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
