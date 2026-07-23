import type { Metadata } from "next";
import { Activity, Cloud, Eye, HelpCircle, Moon, Timer } from "lucide-react";
import { AuroraPolandMap } from "@/components/next/aurora-poland-map";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getPolandAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Zorza polarna w Polsce dzisiaj — mapa i prognoza po województwach | Magnitca";
const pageDescription =
  "Zorza polarna w Polsce dzisiaj: gdzie i kiedy zobaczyć aurorę — prognoza po województwach, Kp-index, zachmurzenie nocne, Księżyc i warunki obserwacji na mapie.";
const pageUrl = "https://magnitca.com/pl/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
    languages: {
      pl: pageUrl,
      "x-default": pageUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
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
    question: "Czy zorzę polarną można zobaczyć w Polsce?",
    answer:
      "Tak, ale nie jest to codzienne zjawisko. W Polsce zorza polarna jest najczęściej widoczna podczas silnych burz geomagnetycznych, gdy owal zorzowy przesuwa się dalej na południe. Największe szanse mają północne województwa, ciemne miejsca poza miastami i otwarty północny horyzont.",
  },
  {
    question: "Co oznacza procent na mapie zorzy?",
    answer:
      "Procent pokazuje orientacyjną ocenę warunków do obserwacji w danym województwie. Nie jest to gwarancja, że zorza na pewno będzie widoczna. Wynik uwzględnia prognozowany Kp-index, szerokość geograficzną regionu, nocne zachmurzenie, jasność Księżyca i ogólną przydatność miejsca do obserwacji.",
  },
  {
    question: "Jaki Kp-index jest potrzebny, żeby zobaczyć zorzę w Polsce?",
    answer:
      "Pierwsze słabe szanse w północnej Polsce mogą pojawiać się przy Kp około 5-6, ale wyraźniejsze obserwacje częściej są związane z Kp 6-7 i wyżej. Im dalej na południe Polski, tym zwykle potrzebna jest silniejsza burza geomagnetyczna oraz bardzo czyste, ciemne niebo.",
  },
  {
    question: "Gdzie w Polsce najlepiej obserwować zorzę polarną?",
    answer:
      "Najlepsze warunki mają zwykle województwa pomorskie, zachodniopomorskie, warmińsko-mazurskie i podlaskie. Dobre miejsca to wybrzeże Bałtyku, okolice jezior, pola i obszary z dala od miejskiej łuny. Najważniejsze jest patrzenie w stronę północnego horyzontu.",
  },
  {
    question: "Dlaczego mapa pokazuje niski wynik mimo burzy magnetycznej?",
    answer:
      "Sama burza geomagnetyczna nie wystarcza. Widoczność zorzy zależy także od zachmurzenia, fazy Księżyca, zanieczyszczenia światłem, przejrzystości atmosfery i tego, czy północny horyzont jest odsłonięty. Chmury lub jasny Księżyc mogą mocno obniżyć realną widoczność.",
  },
  {
    question: "Kiedy najlepiej wypatrywać zorzy polarnej?",
    answer:
      "Najlepiej sprawdzać niebo w ciemnej części nocy, zwykle między około 22:00 a 04:00. Zorza może pojawiać się falami, dlatego przy podwyższonym Kp warto zerkać na północne niebo kilka razy w ciągu nocy, a nie tylko o jednej konkretnej godzinie.",
  },
  {
    question: "Czy zorzę w Polsce widać gołym okiem?",
    answer:
      "Czasem tak, ale często jest słabsza niż na zdjęciach. Aparat z dłuższym czasem naświetlania potrafi zebrać więcej światła, dlatego delikatna czerwona lub zielonkawa poświata może wyglądać na fotografii znacznie wyraźniej niż dla oka.",
  },
  {
    question: "Jak przygotować się do obserwacji zorzy?",
    answer:
      "Wybierz ciemne miejsce poza miastem, unikaj latarni i ekranów, znajdź otwarty widok na północ i daj oczom kilkanaście minut na adaptację do ciemności. Przydadzą się ciepłe ubrania, statyw, telefon lub aparat z trybem nocnym oraz cierpliwość.",
  },
  {
    question: "Z jakich danych korzysta prognoza?",
    answer:
      "Strona korzysta z otwartych danych NOAA SWPC dla aktywności geomagnetycznej i prognozy Kp, Open-Meteo dla nocnego zachmurzenia w województwach, SunCalc dla jasności Księżyca oraz granic administracyjnych geoBoundaries dla mapy.",
  },
  {
    question: "Jak często aktualizuje się mapa zorzy?",
    answer:
      "Obliczenia na stronie odświeżają się mniej więcej co 15 minut. Źródła danych również mają własny rytm aktualizacji, dlatego prognoza może zmieniać się w ciągu wieczoru, zwłaszcza gdy NOAA publikuje nowe dane o aktywności geomagnetycznej.",
  },
];

function formatAuroraDate(dateIso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(new Date(dateIso));
}

function formatCloudCondition(value: number | null) {
  if (value === null) return "nocne zachmurzenie, które jest jeszcze doprecyzowywane";
  if (value <= 25) return `niskie nocne zachmurzenie - około ${value}%`;
  if (value <= 60) return `umiarkowane nocne zachmurzenie - około ${value}%`;
  return `wysokie nocne zachmurzenie - około ${value}%`;
}

function formatMoonCondition(value: number) {
  if (value <= 25) return `Księżyc prawie nie przeszkadza (${value}% oświetlenia)`;
  if (value <= 65) return `Księżyc może częściowo wpływać na widoczność (${value}% oświetlenia)`;
  return `jasny Księżyc może pogarszać widoczność (${value}% oświetlenia)`;
}

function getAuroraChanceColor(value: number) {
  if (value >= 75) return "hsl(16 92% 53%)";
  if (value >= 58) return "hsl(34 96% 52%)";
  if (value >= 38) return "hsl(48 94% 52%)";
  if (value >= 18) return "hsl(145 64% 46%)";
  return "hsl(204 72% 38%)";
}

export default async function PolishAuroraPage() {
  const forecast = await getPolandAuroraForecast();
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
            <a href="/pl" className="text-primary hover:text-primary/80">Magnitca</a>
            <span>/</span>
            <span>Zorza polarna</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Eye className="h-4 w-4" />
                Aurora watch Poland
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Zorza polarna w Polsce
              </h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground">
                Zorza polarna w Polsce dziś, {forecastDate}: mapa po województwach pokazuje,
                w których województwach tej nocy jest największa szansa na obserwację aurory.
                Prognoza uwzględnia Kp-index do {forecast.effectiveKp}, aktywność geomagnetyczną,
                szerokość geograficzną regionu, ciemny północny horyzont, {cloudCondition} oraz fazę Księżyca:
                {` ${moonCondition}.`}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(43_92%_92%)_58%,hsl(var(--card))_100%)] p-4 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">Szansa zobaczenia zorzy:</p>
                <span className="rounded-full bg-[#183966] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">dzisiaj</span>
              </div>
              <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_120px] items-end gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold leading-tight text-foreground">{forecast.summaryLabel}</p>
                </div>
                <div className="relative h-[76px] w-[120px] rounded-xl border border-border/40 bg-card/75 px-1 pt-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]" aria-label={`Szansa zobaczenia zorzy polarnej ${forecast.topChance}%`}>
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">tej nocy</p>
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
            { icon: Activity, label: "Aktywność", value: `Kp ${forecast.effectiveKp}`, hint: `teraz Kp ${forecast.currentKp}` },
            {
              icon: Cloud,
              label: "Chmury",
              value: averageNightCloud === null ? "—" : `${averageNightCloud}%`,
              hint: "średnia ocena nocna",
            },
            {
              icon: Moon,
              label: "Księżyc",
              value: `${forecast.moonIllumination}%`,
              hint: forecast.moonIllumination >= 70 ? "jasna noc" : forecast.moonIllumination >= 35 ? "umiarkowane światło" : "ciemniejsza noc",
            },
            { icon: Timer, label: "Okno", value: "22:00-04:00", hint: "nocne okno prognozy" },
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
          <AuroraPolandMap regions={forecast.regions} />
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4" aria-label="Najczęstsze pytania o zorzę polarną w Polsce">
          <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_0_24px_rgba(34,211,238,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">FAQ</p>
            </div>
            <div className="mb-6 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Najczęstsze pytania o zorzę polarną w Polsce
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Poniżej znajdziesz praktyczne odpowiedzi: jak czytać mapę, kiedy warto patrzeć w niebo i dlaczego prognoza jest wskazówką, a nie gwarancją widoczności.
              </p>
            </div>

            <div className="space-y-4">
              {auroraFaqItems.map((item) => (
                <details key={item.question} className="group rounded-xl border border-border/30 bg-background/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground sm:text-base">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
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
