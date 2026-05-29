import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, HelpCircle, Sunrise, Sunset, SunMedium, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { CityConfig } from "@/data/cities";
import type { SunriseOverviewCity } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type RoCountry = {
  slug: string;
  name: string;
  title: string;
};

type RoCountrySunPageProps = {
  country: RoCountry;
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
  return `${h} h ${m} min`;
}

function cityHref(city: CityConfig) {
  return `/ro/city/${city.slug}`;
}

function pathFor(countrySlug: string, kind: "sunrise" | "sunset", mode: "today" | "tomorrow") {
  const suffix = mode === "tomorrow" ? `${kind}-tomorrow` : kind;
  return `/ro/country/${countrySlug}/${suffix}`;
}

export function RoCountrySunPage({
  country,
  kind,
  mode,
  dateLabel,
  cities,
  earliestSunrise,
  latestSunrise,
  earliestSunset,
  latestSunset,
  averageDayLengthLabel,
}: RoCountrySunPageProps) {
  const isSunrise = kind === "sunrise";
  const isTomorrow = mode === "tomorrow";
  const currentPath = pathFor(country.slug, kind, mode);
  const averageDayLengthMinutes = cities.length
    ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length)
    : 0;
  const averageNightLengthLabel = formatNightLength(averageDayLengthMinutes);
  const primaryEarly = isSunrise ? earliestSunrise : earliestSunset;
  const primaryLate = isSunrise ? latestSunrise : latestSunset;
  const primaryEarlyValue = isSunrise ? primaryEarly?.sunriseLabel : primaryEarly?.sunsetLabel;
  const primaryLateValue = isSunrise ? primaryLate?.sunriseLabel : primaryLate?.sunsetLabel;
  const dayWord = isTomorrow ? "mâine" : "astăzi";

  const h1 = isSunrise
    ? `Răsăritul soarelui în ${country.name} ${dayWord}`
    : `Apusul soarelui în ${country.name} ${dayWord}`;
  const tableTitle = isSunrise
    ? `Răsărit și apus pe orașe din ${country.name}`
    : `Apus, noapte și răsărit pe orașe din ${country.name}`;
  const seoTitle = isSunrise
    ? `Cum se schimbă răsăritul soarelui în ${country.name}`
    : `Cum se schimbă apusul soarelui și durata nopții în ${country.name}`;
  const seoBody = isSunrise
    ? `Ora răsăritului în ${country.name} diferă în funcție de poziția orașului, data din calendar și sezon. Pe această pagină sunt comparate zorii, răsăritul, amiaza solară, apusul, amurgul și durata zilei pentru orașele disponibile.`
    : `Ora apusului în ${country.name} se schimbă zilnic și diferă între orașe. Tabelul ajută la compararea apusului, amurgului, duratei nopții și următorului răsărit pentru localitățile disponibile.`;

  const relatedLinks = isSunrise
    ? [
        { href: pathFor(country.slug, "sunrise", isTomorrow ? "today" : "tomorrow"), label: isTomorrow ? "răsăritul de astăzi" : "răsăritul de mâine" },
        { href: pathFor(country.slug, "sunset", "today"), label: "apusul de astăzi" },
        { href: pathFor(country.slug, "sunset", "tomorrow"), label: "apusul de mâine" },
      ]
    : [
        { href: pathFor(country.slug, "sunset", isTomorrow ? "today" : "tomorrow"), label: isTomorrow ? "apusul de astăzi" : "apusul de mâine" },
        { href: pathFor(country.slug, "sunrise", "today"), label: "răsăritul de astăzi" },
        { href: pathFor(country.slug, "sunrise", "tomorrow"), label: "răsăritul de mâine" },
      ];

  const faqItems = [
    {
      q: isSunrise
        ? `La ce oră răsare soarele în ${country.name} ${dayWord}?`
        : `La ce oră apune soarele în ${country.name} ${dayWord}?`,
      a: `Ora exactă depinde de oraș. Pe această pagină sunt datele pentru ${dateLabel}, iar tabelul arată valorile pentru fiecare oraș disponibil.`,
    },
    {
      q: isSunrise
        ? `Unde este cel mai devreme și cel mai târziu răsărit în ${country.name}?`
        : `Unde este cel mai devreme și cel mai târziu apus în ${country.name}?`,
      a: isSunrise
        ? `Cel mai devreme răsărit este în ${primaryEarly?.city.name ?? "unul dintre orașe"} la ${primaryEarlyValue ?? "—"}, iar cel mai târziu în ${primaryLate?.city.name ?? "alt oraș"} la ${primaryLateValue ?? "—"}.`
        : `Cel mai devreme apus este în ${primaryEarly?.city.name ?? "unul dintre orașe"} la ${primaryEarlyValue ?? "—"}, iar cel mai târziu în ${primaryLate?.city.name ?? "alt oraș"} la ${primaryLateValue ?? "—"}.`,
    },
    {
      q: "Ce înseamnă zori, amiază solară și amurg?",
      a: "Zorii sunt perioada de lumină înainte de răsărit, amiaza solară este momentul în care soarele ajunge cel mai sus pe cer, iar amurgul este lumina naturală rămasă după apus.",
    },
    {
      q: isSunrise ? "Cum se calculează durata zilei?" : "Cum se calculează durata nopții?",
      a: isSunrise
        ? `Durata zilei este intervalul dintre răsărit și apus. Pentru orașele disponibile din ${country.name}, media este aproximativ ${averageDayLengthLabel}.`
        : `Durata nopții este intervalul aproximativ dintre apus și următorul răsărit. Pentru orașele disponibile din ${country.name}, media este aproximativ ${averageNightLengthLabel}.`,
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
      { "@type": "ListItem", position: 1, name: "Acasă", item: absoluteUrl("/ro") },
      { "@type": "ListItem", position: 2, name: country.name, item: absoluteUrl(`/ro/country/${country.slug}`) },
      { "@type": "ListItem", position: 3, name: h1, item: absoluteUrl(currentPath) },
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
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Navigare pe pagină">
          <Link href="/ro" className="transition-colors hover:text-foreground">Acasă</Link>
          <span>/</span>
          <Link href={`/ro/country/${country.slug}`} className="transition-colors hover:text-foreground">{country.name}</Link>
          <span>/</span>
          <span className="text-foreground">{h1}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{h1}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Date pentru {dateLabel}: comparație între orașele din {country.name}, cu orele pentru zori,
          răsărit, amiază solară, apus, amurg și durata zilei sau nopții.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={pathFor(country.slug, kind, "today")} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "today" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? "Răsărit astăzi" : "Apus astăzi"}
          </Link>
          <Link href={pathFor(country.slug, kind, "tomorrow")} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "tomorrow" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? "Răsărit mâine" : "Apus mâine"}
          </Link>
        </div>
      </header>

      <MobileAdsenseSlot />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? "Cel mai devreme răsărit" : "Cel mai devreme apus"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryEarlyValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryEarly?.city.name ?? "Datele se actualizează"}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? "Cel mai târziu răsărit" : "Cel mai târziu apus"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryLateValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryLate?.city.name ?? "Datele se actualizează"}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-4 w-4 text-primary" />
            {isSunrise ? "Durata medie a zilei" : "Durata medie a nopții"}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{isSunrise ? averageDayLengthLabel : averageNightLengthLabel}</p>
            <p className="text-sm text-muted-foreground">Pe orașele din {country.name}</p>
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
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Zori</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} className="text-amber-300" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Răsărit</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} className="text-primary" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Apus</p>
                  <div className="mt-2"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} className="text-orange-400" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{isSunrise ? "Durata zilei" : "Durata nopții"}</p>
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
                <th className="px-3 py-3">Oraș</th>
                <th className="px-3 py-3">Zori</th>
                <th className="px-3 py-3">Răsărit</th>
                <th className="px-3 py-3">Amiază solară</th>
                <th className="px-3 py-3">Apus</th>
                <th className="px-3 py-3">Amurg</th>
                <th className="px-3 py-3">{isSunrise ? "Durata zilei" : "Durata nopții"}</th>
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
          Mai poți verifica:{" "}
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
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Întrebări frecvente</h2>
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
