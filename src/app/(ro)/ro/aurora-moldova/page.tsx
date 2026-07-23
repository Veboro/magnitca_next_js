import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getMoldovaAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Aurora boreală în Moldova azi — hartă și prognoză pe raioane | Magnitca";
const pageDescription =
  "Aurora boreală în Moldova azi: unde și când poți vedea aurora — prognoză pe raioane, Kp-index, nori, Lună și condiții de observare pe hartă.";
const pageUrl = "https://magnitca.com/ro/aurora-moldova";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "ro_MD",
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
    question: "Se poate vedea aurora boreală în Republica Moldova?",
    answer:
      "Da, dar foarte rar. Moldova se află destul de la sud pentru observații frecvente, astfel că sunt necesare furtuni geomagnetice puternice sau foarte puternice, cer senin și un orizont nordic cât mai întunecat.",
  },
  {
    question: "Care raioane au șanse mai bune?",
    answer:
      "În general nordul țării are un mic avantaj: Briceni, Ocnița, Dondușeni, Edineț, Soroca, Drochia și zonele din apropierea hotarului de nord. Totuși, norii și lumina orașelor pot schimba complet situația.",
  },
  {
    question: "Ce arată procentul de pe hartă?",
    answer:
      "Procentul estimează condițiile de observare pentru fiecare raion. El combină Kp-indexul prognozat, latitudinea, norii din timpul nopții, faza Lunii și cât de favorabilă este zona pentru un orizont nordic deschis.",
  },
  {
    question: "Ce Kp trebuie pentru Moldova?",
    answer:
      "Pentru Moldova, de regulă, este nevoie de Kp foarte ridicat. Șanse slabe pot apărea în nord la Kp 6-7, iar observațiile mai clare devin mai realiste la valori și mai mari, cu cer foarte curat.",
  },
  {
    question: "Poate camera vedea aurora mai bine decât ochiul?",
    answer:
      "Da. În sud-estul Europei aurora poate fi foarte slabă cu ochiul liber, dar telefonul sau aparatul foto în modul noapte poate surprinde o lumină roșiatică sau verzuie mai clar decât o percepem direct.",
  },
  {
    question: "Când merită să ies la observații?",
    answer:
      "Merită doar când Kp este ridicat și cerul este suficient de senin. Cea mai bună fereastră este noaptea întunecată, de obicei între 22:00 și 04:00, privind spre nord.",
  },
  {
    question: "Ce date folosește harta?",
    answer:
      "Harta folosește date NOAA SWPC pentru activitatea geomagnetică, Open-Meteo pentru nebulozitatea nocturnă, SunCalc pentru Lună și geoBoundaries pentru limitele raioanelor.",
  },
  {
    question: "Prognoza este o garanție?",
    answer:
      "Nu. Este o estimare practică a condițiilor. Aurora rămâne un fenomen rapid și imprevizibil, iar condițiile locale de cer pot decide dacă observația reușește sau nu.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Chisinau",
  }).format(new Date(dateIso));
}

export default async function MoldovaAuroraPage() {
  const forecast = await getMoldovaAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = forecast.averageNightCloud === null
    ? "nebulozitatea nocturnă este încă în curs de actualizare"
    : `nebulozitatea nocturnă medie este de aproximativ ${forecast.averageNightCloud}%`;

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/ro"
      homeLabel="Magnitca"
      breadcrumbLabel="Aurora boreală Moldova"
      badge="Aurora watch Moldova"
      title="Aurora boreală în Moldova"
      intro={`Aurora boreală în Republica Moldova azi, ${date}: harta pe raioane arată unde există șanse de observare în această noapte. Prognoza ia în calcul Kp-index până la ${forecast.effectiveKp}, activitatea geomagnetică, latitudinea raioanelor, ${clouds} și iluminarea Lunii de ${forecast.moonIllumination}%.`}
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
        boundariesUrl: "/geo/moldova-districts.geojson",
        center: [47.1, 28.6],
        zoom: 8,
        minZoom: 6,
        maxZoom: 10,
        regions: forecast.regions,
        labels: {
          legend: "Șansa de a vedea aurora boreală",
          chance: "Șansă",
          boundariesError: "Nu s-au putut încărca limitele raioanelor.",
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
        title: "Întrebări despre aurora boreală în Moldova",
        intro: "Răspunsuri despre șansele reale de observare, raioane, Kp-index și condițiile meteo care contează cel mai mult.",
        items: faqItems,
      }}
    />
  );
}
