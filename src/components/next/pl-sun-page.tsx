import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, HelpCircle, Sunrise, Sunset, SunMedium, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { CityConfig } from "@/data/cities";
import type { SunriseOverviewCity } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type PlSunPageProps = {
  locale?: "pl" | "hu";
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

function formatNightLength(minutes: number, locale: "pl" | "hu" = "pl") {
  const nightMinutes = Math.max(0, 24 * 60 - minutes);
  const h = Math.floor(nightMinutes / 60);
  const m = nightMinutes % 60;
  if (locale === "hu") {
    return `${h} óra ${m} perc`;
  }
  return `${h} godz. ${m} min`;
}

function cityHref(city: CityConfig, locale: "pl" | "hu") {
  return `/${locale}/city/${city.slug}`;
}

function pathFor(kind: "sunrise" | "sunset", mode: "today" | "tomorrow", locale: "pl" | "hu") {
  return `/${locale}/${mode === "tomorrow" ? `${kind}-tomorrow` : kind}`;
}

export function PlSunPage({
  locale = "pl",
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
  const currentPath = pathFor(kind, mode, locale);
  const averageDayLengthMinutes = cities.length
    ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length)
    : 0;
  const averageNightLengthLabel = formatNightLength(averageDayLengthMinutes, locale);
  const primaryEarly = isSunrise ? earliestSunrise : earliestSunset;
  const primaryLate = isSunrise ? latestSunrise : latestSunset;
  const primaryEarlyValue = isSunrise ? primaryEarly?.sunriseLabel : primaryEarly?.sunsetLabel;
  const primaryLateValue = isSunrise ? primaryLate?.sunriseLabel : primaryLate?.sunsetLabel;
  const copy = locale === "hu"
    ? {
        home: "Főoldal",
        countryIn: "Magyarországon",
        countryCities: "Magyarország városaiban",
        today: "ma",
        tomorrow: "holnap",
        sunriseToday: "Napkelte ma",
        sunriseTomorrow: "Napkelte holnap",
        sunsetToday: "Napnyugta ma",
        sunsetTomorrow: "Napnyugta holnap",
        sunrise: "Napkelte",
        sunset: "Napnyugta",
        earliestSunrise: "Legkorábbi napkelte",
        latestSunrise: "Legkésőbbi napkelte",
        earliestSunset: "Legkorábbi napnyugta",
        latestSunset: "Legkésőbbi napnyugta",
        averageDay: "Átlagos nappalhossz",
        averageNight: "Átlagos éjszakahossz",
        dataUpdated: "Az adatok frissülnek",
        sourceCities: "Az elérhető városok alapján",
        tableSunrise: "Napkelte és napnyugta Magyarország városaiban",
        tableSunset: "Napnyugta, éjszaka és napkelte Magyarország városaiban",
        seoSunriseTitle: "Hogyan változik a napkelte ideje Magyarországon",
        seoSunsetTitle: "Hogyan változik a napnyugta és az éjszaka hossza Magyarországon",
        seoSunriseBody:
          "A napkelte időpontja Magyarországon városonként, dátumonként és földrajzi helyzet szerint változik. Ezen az oldalon összehasonlítható a hajnal, a napkelte, a nap delelése, a napnyugta, az alkonyat és a nappal hossza az elérhető városokban.",
        seoSunsetBody:
          "A napnyugta ideje Magyarországon napról napra változik, és városonként is eltér. A táblázat segít összehasonlítani a napnyugtát, az alkonyatot, az éjszaka hosszát és a következő napkelte idejét.",
        intro:
          `Adatok ${dateLabel} napjára: magyarországi városok összehasonlítása hajnal, napkelte, nap delelése, napnyugta, alkonyat és a nappal vagy éjszaka hossza szerint.`,
        alsoCheck: "Érdemes megnézni:",
        faqTitle: "Gyakori kérdések",
        city: "Város",
        dawn: "Hajnal",
        solarNoon: "Nap delelése",
        dusk: "Alkonyat",
        dayLength: "Nappal hossza",
        nightLength: "Éjszaka hossza",
        exactHourDepends: `A pontos időpont városonként eltér. Ezen az oldalon a ${dateLabel} napjára vonatkozó adatokat mutatjuk, a táblázatban pedig minden elérhető város értékei ellenőrizhetők.`,
        termsQuestion: "Mit jelent a hajnal, a nap delelése és az alkonyat?",
        termsAnswer:
          "A hajnal a napkelte előtti világosodó időszak, a nap delelése az a pillanat, amikor a Nap a legmagasabban áll az égen, az alkonyat pedig a napnyugta utáni természetes fény.",
      }
    : {
        home: "Strona główna",
        countryIn: "w Polsce",
        countryCities: "Polski",
        today: "dzisiaj",
        tomorrow: "jutro",
        sunriseToday: "Wschód dzisiaj",
        sunriseTomorrow: "Wschód jutro",
        sunsetToday: "Zachód dzisiaj",
        sunsetTomorrow: "Zachód jutro",
        sunrise: "Wschód",
        sunset: "Zachód",
        earliestSunrise: "Najwcześniejszy wschód",
        latestSunrise: "Najpóźniejszy wschód",
        earliestSunset: "Najwcześniejszy zachód",
        latestSunset: "Najpóźniejszy zachód",
        averageDay: "Średnia długość dnia",
        averageNight: "Średnia długość nocy",
        dataUpdated: "Dane są aktualizowane",
        sourceCities: "Na podstawie dostępnych miast",
        tableSunrise: "Wschód i zachód słońca w miastach Polski",
        tableSunset: "Zachód, noc i wschód słońca w miastach Polski",
        seoSunriseTitle: "Jak zmienia się wschód słońca w Polsce",
        seoSunsetTitle: "Jak zmienia się zachód słońca i długość nocy w Polsce",
        seoSunriseBody:
          "Godzina wschodu słońca w Polsce zależy od miasta, daty i położenia geograficznego. Na tej stronie porównujemy świt, wschód, południe słoneczne, zachód, zmierzch i długość dnia dla dostępnych miast.",
        seoSunsetBody:
          "Godzina zachodu słońca w Polsce zmienia się z dnia na dzień i różni się między miastami. Tabela pomaga porównać zachód, zmierzch, długość nocy oraz kolejny wschód słońca.",
        intro:
          `Dane dla ${dateLabel}: porównanie miast w Polsce, z godzinami świtu, wschodu, południa słonecznego, zachodu, zmierzchu oraz długością dnia lub nocy.`,
        alsoCheck: "Warto też sprawdzić:",
        faqTitle: "Najczęstsze pytania",
        city: "Miasto",
        dawn: "Świt",
        solarNoon: "Południe słoneczne",
        dusk: "Zmierzch",
        dayLength: "Długość dnia",
        nightLength: "Długość nocy",
        exactHourDepends: `Dokładna godzina zależy od miasta. Na tej stronie pokazujemy dane dla ${dateLabel}, a w tabeli można sprawdzić wartości dla każdego dostępnego miasta.`,
        termsQuestion: "Co oznaczają świt, południe słoneczne i zmierzch?",
        termsAnswer:
          "Świt to okres światła przed wschodem słońca, południe słoneczne oznacza moment najwyższego położenia słońca na niebie, a zmierzch to naturalne światło po zachodzie.",
      };
  const dayWord = isTomorrow ? copy.tomorrow : copy.today;

  const h1 = isSunrise ? `${copy.sunrise} słońca ${copy.countryIn} ${dayWord}` : `${copy.sunset} słońca ${copy.countryIn} ${dayWord}`;
  const localizedH1 =
    locale === "hu"
      ? isSunrise
        ? `Napkelte Magyarországon ${dayWord}`
        : `Napnyugta Magyarországon ${dayWord}`
      : h1;
  const tableTitle = isSunrise ? copy.tableSunrise : copy.tableSunset;
  const seoTitle = isSunrise ? copy.seoSunriseTitle : copy.seoSunsetTitle;
  const seoBody = isSunrise ? copy.seoSunriseBody : copy.seoSunsetBody;

  const relatedLinks = isSunrise
    ? [
        { href: pathFor("sunrise", isTomorrow ? "today" : "tomorrow", locale), label: isTomorrow ? copy.sunriseToday.toLowerCase() : copy.sunriseTomorrow.toLowerCase() },
        { href: pathFor("sunset", "today", locale), label: copy.sunsetToday.toLowerCase() },
        { href: pathFor("sunset", "tomorrow", locale), label: copy.sunsetTomorrow.toLowerCase() },
      ]
    : [
        { href: pathFor("sunset", isTomorrow ? "today" : "tomorrow", locale), label: isTomorrow ? copy.sunsetToday.toLowerCase() : copy.sunsetTomorrow.toLowerCase() },
        { href: pathFor("sunrise", "today", locale), label: copy.sunriseToday.toLowerCase() },
        { href: pathFor("sunrise", "tomorrow", locale), label: copy.sunriseTomorrow.toLowerCase() },
      ];

  const faqItems = [
    {
      q: isSunrise
        ? locale === "hu"
          ? `Mikor van napkelte Magyarországon ${dayWord}?`
          : `O której jest wschód słońca w Polsce ${dayWord}?`
        : locale === "hu"
          ? `Mikor van napnyugta Magyarországon ${dayWord}?`
          : `O której jest zachód słońca w Polsce ${dayWord}?`,
      a: copy.exactHourDepends,
    },
    {
      q: isSunrise
        ? locale === "hu"
          ? "Hol van a legkorábbi és a legkésőbbi napkelte?"
          : "Gdzie jest najwcześniejszy i najpóźniejszy wschód słońca?"
        : locale === "hu"
          ? "Hol van a legkorábbi és a legkésőbbi napnyugta?"
          : "Gdzie jest najwcześniejszy i najpóźniejszy zachód słońca?",
      a: locale === "hu"
        ? isSunrise
          ? `A legkorábbi napkelte ${primaryEarly?.city.name ?? "az egyik városban"} van, ${primaryEarlyValue ?? "—"} időpontban, a legkésőbbi pedig ${primaryLate?.city.name ?? "egy másik városban"}, ${primaryLateValue ?? "—"} időpontban.`
          : `A legkorábbi napnyugta ${primaryEarly?.city.name ?? "az egyik városban"} van, ${primaryEarlyValue ?? "—"} időpontban, a legkésőbbi pedig ${primaryLate?.city.name ?? "egy másik városban"}, ${primaryLateValue ?? "—"} időpontban.`
        : isSunrise
          ? `Najwcześniejszy wschód jest w ${primaryEarly?.city.name ?? "jednym z miast"} o ${primaryEarlyValue ?? "—"}, a najpóźniejszy w ${primaryLate?.city.name ?? "innym mieście"} o ${primaryLateValue ?? "—"}.`
          : `Najwcześniejszy zachód jest w ${primaryEarly?.city.name ?? "jednym z miast"} o ${primaryEarlyValue ?? "—"}, a najpóźniejszy w ${primaryLate?.city.name ?? "innym mieście"} o ${primaryLateValue ?? "—"}.`,
    },
    {
      q: copy.termsQuestion,
      a: copy.termsAnswer,
    },
    {
      q: isSunrise
        ? locale === "hu"
          ? "Hogyan számoljuk a nappal hosszát?"
          : "Jak obliczana jest długość dnia?"
        : locale === "hu"
          ? "Hogyan számoljuk az éjszaka hosszát?"
          : "Jak obliczana jest długość nocy?",
      a: isSunrise
        ? locale === "hu"
          ? `A nappal hossza a napkelte és a napnyugta közötti idő. Az elérhető városok átlaga körülbelül ${averageDayLengthLabel}.`
          : `Długość dnia to czas między wschodem i zachodem słońca. Średnia dla dostępnych miast wynosi około ${averageDayLengthLabel}.`
        : locale === "hu"
          ? `Az éjszaka hossza a napnyugta és a következő napkelte közötti hozzávetőleges idő. Az elérhető városok átlaga körülbelül ${averageNightLengthLabel}.`
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
      { "@type": "ListItem", position: 1, name: copy.home, item: absoluteUrl(`/${locale}`) },
      { "@type": "ListItem", position: 2, name: localizedH1, item: absoluteUrl(currentPath) },
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
          <Link href={`/${locale}`} className="transition-colors hover:text-foreground">{copy.home}</Link>
          <span>/</span>
          <span className="text-foreground">{localizedH1}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{localizedH1}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {copy.intro}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={pathFor(kind, "today", locale)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "today" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? copy.sunriseToday : copy.sunsetToday}
          </Link>
          <Link href={pathFor(kind, "tomorrow", locale)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === "tomorrow" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"}`}>
            {isSunrise ? copy.sunriseTomorrow : copy.sunsetTomorrow}
          </Link>
        </div>
      </header>

      <MobileAdsenseSlot />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? copy.earliestSunrise : copy.earliestSunset}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryEarlyValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryEarly?.city.name ?? copy.dataUpdated}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isSunrise ? <Sunrise className="h-4 w-4 text-primary" /> : <Sunset className="h-4 w-4 text-primary" />}
            {isSunrise ? copy.latestSunrise : copy.latestSunset}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{primaryLateValue ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{primaryLate?.city.name ?? copy.dataUpdated}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-4 w-4 text-primary" />
            {isSunrise ? copy.averageDay : copy.averageNight}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{isSunrise ? averageDayLengthLabel : averageNightLengthLabel}</p>
            <p className="text-sm text-muted-foreground">{copy.sourceCities}</p>
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
              <Link href={cityHref(item.city, locale)} className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary">
                {item.city.name}
                <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{copy.dawn}</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} className="text-amber-300" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{copy.sunrise}</p>
                  <div className="mt-2"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} className="text-primary" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{copy.sunset}</p>
                  <div className="mt-2"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} className="text-orange-400" /></div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{isSunrise ? copy.dayLength : copy.nightLength}</p>
                  <p className="mt-2 font-mono text-foreground">{isSunrise ? item.dayLength : formatNightLength(item.dayLengthMinutes, locale)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[920px] w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-3 py-3">{copy.city}</th>
                <th className="px-3 py-3">{copy.dawn}</th>
                <th className="px-3 py-3">{copy.sunrise}</th>
                <th className="px-3 py-3">{copy.solarNoon}</th>
                <th className="px-3 py-3">{copy.sunset}</th>
                <th className="px-3 py-3">{copy.dusk}</th>
                <th className="px-3 py-3">{isSunrise ? copy.dayLength : copy.nightLength}</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((item) => (
                <tr key={item.city.slug} className="border-b border-border/20 last:border-0">
                  <td className="px-3 py-3">
                    <Link href={cityHref(item.city, locale)} className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary">
                      {item.city.name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
                    </Link>
                  </td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} className="text-amber-300" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} className="text-primary" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<SunMedium className="h-3.5 w-3.5" />} value={item.solarNoonLabel} className="text-yellow-400" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} className="text-orange-400" /></td>
                  <td className="px-3 py-3"><TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.duskLabel} className="text-indigo-300" /></td>
                  <td className="px-3 py-3 text-muted-foreground">{isSunrise ? item.dayLength : formatNightLength(item.dayLengthMinutes, locale)}</td>
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
          {copy.alsoCheck}{" "}
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
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{copy.faqTitle}</h2>
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
