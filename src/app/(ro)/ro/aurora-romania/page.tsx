import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getRomaniaAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Aurora boreală în România azi — hartă și prognoză pe județe | Magnitca";
const pageDescription =
  "Aurora boreală în România azi: unde și când poți vedea aurora — prognoză pe județe, Kp-index, nori noaptea, Lună și condiții reale de observare pe hartă.";
const pageUrl = "https://magnitca.com/ro/aurora-romania";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Magnitca",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

const faqItems = [
  {
    question: "Se poate vedea aurora boreală în România?",
    answer:
      "Da, dar este un fenomen rar. În România aurora boreală poate apărea mai ales în timpul furtunilor geomagnetice puternice, când ovalul auroral se extinde mult spre sud. Cele mai bune șanse sunt în nordul și nord-estul țării, departe de luminile orașelor.",
  },
  {
    question: "Ce înseamnă procentul de pe hartă?",
    answer:
      "Procentul este o estimare orientativă a condițiilor pentru observare în fiecare județ. Calculul combină prognoza Kp, latitudinea județului, norii din timpul nopții, luminozitatea Lunii și poziția față de orizontul nordic.",
  },
  {
    question: "Ce Kp este necesar pentru România?",
    answer:
      "De obicei este nevoie de un Kp ridicat. Primele șanse slabe pot apărea în nordul României la valori în jur de Kp 6, iar observațiile mai clare sunt mai probabile la Kp 7 sau peste, cu cer foarte curat.",
  },
  {
    question: "Unde sunt cele mai bune zone din România?",
    answer:
      "Județele din nord, precum Suceava, Botoșani, Maramureș, Satu Mare, Bistrița-Năsăud și Iași, au de obicei un avantaj. Pentru observații reale contează însă mult mai mult cerul senin, lipsa poluării luminoase și un orizont nordic deschis.",
  },
  {
    question: "De ce poate fi șansa mică deși există furtună magnetică?",
    answer:
      "O furtună geomagnetică nu garantează vizibilitatea. Norii, Luna plină, ceața, lumina orașelor și poziția sudică pot face ca aurora să fie invizibilă chiar și în timpul unei activități geomagnetice ridicate.",
  },
  {
    question: "Când este cel mai bine să verific cerul?",
    answer:
      "Intervalul util este partea întunecată a nopții, aproximativ între 22:00 și 04:00. Dacă prognoza arată Kp ridicat, merită să verificați orizontul nordic de mai multe ori, deoarece activitatea poate veni în valuri scurte.",
  },
  {
    question: "Ce date folosește prognoza?",
    answer:
      "Pagina combină date NOAA SWPC pentru activitatea geomagnetică, prognoza Kp, Open-Meteo pentru nebulozitate nocturnă, SunCalc pentru iluminarea Lunii și geoBoundaries pentru limitele județelor.",
  },
  {
    question: "Harta garantează că voi vedea aurora?",
    answer:
      "Nu. Harta este un ghid practic, nu o garanție. Un procent ridicat înseamnă că mai multe condiții sunt favorabile, dar vizibilitatea finală depinde de cerul real din locul în care observați.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bucharest",
  }).format(new Date(dateIso));
}

export default async function RomaniaAuroraPage() {
  const forecast = await getRomaniaAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = forecast.averageNightCloud === null
    ? "nebulozitatea nocturnă este încă în curs de actualizare"
    : `nebulozitatea nocturnă medie este de aproximativ ${forecast.averageNightCloud}%`;

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/ro"
      homeLabel="Magnitca"
      breadcrumbLabel="Aurora boreală România"
      badge="Aurora watch Romania"
      title="Aurora boreală în România"
      intro={`Aurora boreală în România azi, ${date}: harta pe județe arată unde există șanse de observare în această noapte. Prognoza ia în calcul Kp-index până la ${forecast.effectiveKp}, activitatea geomagnetică, latitudinea județului, ${clouds} și iluminarea Lunii de ${forecast.moonIllumination}%.`}
      chanceLabel="Șansa de a vedea aurora:"
      todayLabel="astăzi"
      tonightLabel="în noaptea asta"
      metrics={{
        activity: "Activitate",
        currentKp: "acum Kp",
        clouds: "Nori",
        cloudHint: "medie nocturnă",
        moon: "Luna",
        moonHints: {
          bright: "noapte luminoasă",
          moderate: "lumină moderată",
          dark: "noapte mai întunecată",
        },
        window: "Interval",
        windowValue: "22:00-04:00",
        windowHint: "fereastră nocturnă",
      }}
      map={{
        boundariesUrl: "/geo/romania-counties.geojson",
        center: [45.9, 24.9],
        zoom: 7,
        minZoom: 5,
        maxZoom: 9,
        regions: forecast.regions,
        labels: {
          legend: "Șansa de a vedea aurora boreală",
          chance: "Șansă",
          boundariesError: "Nu s-au putut încărca limitele județelor.",
        },
        legend: [
          { label: "foarte mare", tone: "veryHigh" },
          { label: "mare", tone: "high" },
          { label: "moderată", tone: "medium" },
          { label: "scăzută", tone: "low" },
          { label: "aproape zero", tone: "none" },
        ],
      }}
      faq={{
        eyebrow: "FAQ",
        title: "Întrebări despre aurora boreală în România",
        intro: "Răspunsuri rapide despre Kp-index, județe, nori, Lună și modul corect de interpretare a hărții.",
        items: faqItems,
      }}
    />
  );
}
