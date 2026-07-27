import type { SiteLocale } from "@/lib/locale";

// Unique, mostly-static SEO body content for city pages. The live geomagnetic
// numbers (Kp, G/R/S) are global and therefore identical across every city on a
// given day, which is why hundreds of city pages were flagged "Crawled –
// currently not indexed" (Google treated them as near-duplicates). This module
// derives genuinely distinct prose per city from stable attributes — region,
// coordinates, latitude-based aurora visibility and timezone — plus a small FAQ.

export type CityFaqItem = { question: string; answer: string };
export type CitySeoContent = { paragraphs: string[]; faq: CityFaqItem[] };

export const CITY_FAQ_HEADING: Record<SiteLocale, string> = {
  uk: "Часті запитання",
  ru: "Частые вопросы",
  pl: "Częste pytania",
  ro: "Întrebări frecvente",
  hu: "Gyakori kérdések",
  bg: "Често задавани въпроси",
  cs: "Časté dotazy",
  en: "Frequently asked questions",
};

export type CityContentInput = {
  locale: SiteLocale;
  name: string; // nominative, e.g. "Львів"
  locative: string; // locative/prepositional form, e.g. "Львові" (used after в/у)
  genitive: string; // genitive form, e.g. "Львова" (used after для)
  preposition: string; // euphonic preposition for the locative (в/у, в/во); "" for others
  latLabel: string;
  lonLabel: string;
  lat: number;
  utcOffset: string;
  timezone: string;
  regionLabel: string; // uk/ru: "Львівська область, Україна"; pl: locative voivodeship ("województwie mazowieckim"); ro: region titleIn ("județul Cluj"); hu: locative vármegye ("Pest vármegyében"); en: country name
};

type Band = "high" | "mid" | "low";

function latBand(lat: number): Band {
  if (lat >= 51) return "high";
  if (lat >= 48) return "mid";
  return "low";
}

const AURORA_NOTE: Record<SiteLocale, Record<Band, string>> = {
  uk: {
    high: "На широті понад 51° полярні сяйва тут можливі під час сильних бур рівня G2–G3 і вище.",
    mid: "На цій широті полярні сяйва видно рідко — переважно під час потужних бур рівня G3–G5.",
    low: "На південній широті регіону полярні сяйва трапляються дуже рідко, лише під час екстремальних бур G4–G5.",
  },
  ru: {
    high: "На широте выше 51° полярные сияния здесь возможны во время сильных бурь уровня G2–G3 и выше.",
    mid: "На этой широте полярные сияния видны редко — в основном во время мощных бурь уровня G3–G5.",
    low: "На южной широте региона полярные сияния случаются очень редко, только во время экстремальных бурь G4–G5.",
  },
  pl: {
    high: "Na szerokości powyżej 51° zorze polarne są tu możliwe podczas silnych burz poziomu G2–G3 i wyższych.",
    mid: "Na tej szerokości zorze polarne widać rzadko — głównie podczas silnych burz poziomu G3–G5.",
    low: "Na tej szerokości zorze polarne pojawiają się bardzo rzadko, tylko podczas ekstremalnych burz G4–G5.",
  },
  ro: {
    high: "La o latitudine de peste 51°, aurorele boreale sunt posibile aici în timpul furtunilor puternice de nivel G2–G3 și mai sus.",
    mid: "La această latitudine aurorele boreale se văd rar — mai ales în timpul furtunilor puternice de nivel G3–G5.",
    low: "La această latitudine aurorele boreale apar foarte rar, doar în timpul furtunilor extreme G4–G5.",
  },
  hu: {
    high: "51° feletti szélességen a sarki fény itt erős, G2–G3 vagy nagyobb szintű viharok idején látható.",
    mid: "Ezen a szélességen a sarki fény ritkán látható — főként erős, G3–G5 szintű viharok idején.",
    low: "Ezen a szélességen a sarki fény nagyon ritkán, csak szélsőséges G4–G5 viharok idején jelenik meg.",
  },
  bg: {
    high: "На географска ширина над 51° северно сияние тук е възможно по време на силни бури от ниво G2–G3 и по-високо.",
    mid: "На тази географска ширина северното сияние се вижда рядко — предимно по време на силни бури от ниво G3–G5.",
    low: "На тази южна географска ширина северното сияние се появява много рядко, само при екстремни бури G4–G5.",
  },
  cs: {
    high: "Na zeměpisné šířce nad 51° je zde polární záře možná během silných bouří úrovně G2–G3 a vyšších.",
    mid: "Na této zeměpisné šířce je polární záře vidět zřídka — hlavně během silných bouří úrovně G3–G5.",
    low: "Na této jižnější zeměpisné šířce se polární záře objevuje velmi zřídka, jen při extrémních bouřích G4–G5.",
  },
  en: {
    high: "At a latitude above 51°, auroras are possible here during strong G2–G3 storms and above.",
    mid: "At this latitude auroras are rarely visible — mostly during strong G3–G5 storms.",
    low: "At this latitude auroras appear very rarely, only during extreme G4–G5 storms.",
  },
};

export function getCitySeoContent(input: CityContentInput): CitySeoContent {
  const { locale, name, locative, genitive, latLabel, lonLabel, lat, utcOffset, timezone, regionLabel } = input;
  const prep = input.preposition ? `${input.preposition} ` : "";
  const aurora = AURORA_NOTE[locale][latBand(lat)];

  switch (locale) {
    case "ru": {
      const inCity = `${prep}${locative}`;
      return {
        paragraphs: [
          `Город ${name} расположен на широте ${latLabel} и долготе ${lonLabel}; регион — ${regionLabel} (часовой пояс ${timezone}, ${utcOffset}). ${aurora}`,
          `Геомагнитная активность определяется планетарным Kp-индексом, общим для всей планеты, однако ощутимость магнитных бурь зависит от широты. На этой странице мы показываем Kp-индекс ${inCity}, прогноз на 3 и 27 дней, уровень бури по шкале G, погоду, восход и закат солнца и качество воздуха — в реальном времени по данным NOAA SWPC, Укргидрометцентра и Open-Meteo.`,
        ],
        faq: [
          {
            question: `Будет ли магнитная буря ${inCity} сегодня?`,
            answer: `Актуальное состояние геомагнитного поля ${inCity} обновляется в реальном времени по данным NOAA SWPC. Текущий Kp-индекс, уровень бури по шкале G и прогноз на ближайшие 3 дня приведены выше на этой странице.`,
          },
          {
            question: `Можно ли увидеть полярное сияние ${inCity}?`,
            answer: `${aurora} Координаты города: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Откуда данные о магнитных бурях для ${genitive}?`,
            answer: `Данные Kp-индекса и шкал G/R/S предоставляет NOAA Space Weather Prediction Center, предупреждения — Укргидрометцентр, погоду и качество воздуха — Open-Meteo. Время указано по местному поясу ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
    case "pl": {
      const inCity = `w mieście ${name}`;
      return {
        paragraphs: [
          `Miasto ${name} leży w ${regionLabel}, na szerokości ${latLabel} i długości ${lonLabel} (strefa czasowa ${timezone}, ${utcOffset}). ${aurora}`,
          `Aktywność geomagnetyczną określa planetarny indeks Kp, wspólny dla całej planety, jednak odczuwalność burz magnetycznych zależy od szerokości geograficznej. Na tej stronie pokazujemy indeks Kp ${inCity}, prognozę na 3 i 27 dni, poziom burzy w skali G, pogodę, wschód i zachód słońca oraz jakość powietrza — w czasie rzeczywistym na podstawie danych NOAA SWPC i Open-Meteo.`,
        ],
        faq: [
          {
            question: `Czy dzisiaj wystąpi burza magnetyczna ${inCity}?`,
            answer: `Aktualny stan pola geomagnetycznego ${inCity} jest aktualizowany w czasie rzeczywistym na podstawie danych NOAA SWPC. Bieżący indeks Kp, poziom burzy w skali G oraz prognozę na najbliższe 3 dni podano powyżej na tej stronie.`,
          },
          {
            question: `Czy ${inCity} można zobaczyć zorzę polarną?`,
            answer: `${aurora} Współrzędne miasta: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Skąd pochodzą dane o burzach magnetycznych dla miasta ${name}?`,
            answer: `Dane indeksu Kp oraz skal G/R/S pochodzą z NOAA Space Weather Prediction Center, a pogoda i jakość powietrza z Open-Meteo. Czas podano w lokalnej strefie ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
    case "ro": {
      const inCity = `în orașul ${name}`;
      return {
        paragraphs: [
          `Orașul ${name} este situat în ${regionLabel}, la latitudinea ${latLabel} și longitudinea ${lonLabel} (fus orar ${timezone}, ${utcOffset}). ${aurora}`,
          `Activitatea geomagnetică este determinată de indicele planetar Kp, comun întregii planete, însă intensitatea resimțită a furtunilor magnetice depinde de latitudine. Pe această pagină afișăm indicele Kp ${inCity}, prognoza pe 3 și 27 de zile, nivelul furtunii pe scara G, vremea, răsăritul și apusul soarelui și calitatea aerului — în timp real, pe baza datelor NOAA SWPC și Open-Meteo.`,
        ],
        faq: [
          {
            question: `Va fi furtună magnetică ${inCity} astăzi?`,
            answer: `Starea actuală a câmpului geomagnetic ${inCity} este actualizată în timp real pe baza datelor NOAA SWPC. Indicele Kp curent, nivelul furtunii pe scara G și prognoza pentru următoarele 3 zile sunt afișate mai sus pe această pagină.`,
          },
          {
            question: `Se poate vedea aurora boreală ${inCity}?`,
            answer: `${aurora} Coordonatele orașului: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `De unde provin datele despre furtunile magnetice pentru orașul ${name}?`,
            answer: `Datele indicelui Kp și ale scărilor G/R/S provin de la NOAA Space Weather Prediction Center, iar vremea și calitatea aerului de la Open-Meteo. Ora este indicată în fusul local ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
    case "hu": {
      const inCity = `${name} városában`;
      return {
        paragraphs: [
          `${name} városa ${regionLabel} fekszik, ${latLabel} szélességen és ${lonLabel} hosszúságon (időzóna: ${timezone}, ${utcOffset}). ${aurora}`,
          `A geomágneses aktivitást a bolygószintű Kp-index határozza meg, amely az egész Földre közös, a mágneses viharok érzékelhetősége azonban a földrajzi szélességtől függ. Ezen az oldalon a Kp-indexet ${inCity}, a 3 és 27 napos előrejelzést, a vihar G-skála szerinti szintjét, az időjárást, a napkeltét és napnyugtát, valamint a levegőminőséget mutatjuk — valós időben, a NOAA SWPC és az Open-Meteo adatai alapján.`,
        ],
        faq: [
          {
            question: `Lesz-e ma mágneses vihar ${inCity}?`,
            answer: `A geomágneses mező aktuális állapota ${inCity} valós időben frissül a NOAA SWPC adatai alapján. Az aktuális Kp-index, a vihar G-skála szerinti szintje és a következő 3 nap előrejelzése fentebb, ezen az oldalon látható.`,
          },
          {
            question: `Látható-e a sarki fény ${inCity}?`,
            answer: `${aurora} A város koordinátái: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Honnan származnak a mágneses viharokra vonatkozó adatok ${name} városára?`,
            answer: `A Kp-index és a G/R/S skálák adatait a NOAA Space Weather Prediction Center szolgáltatja, az időjárást és a levegőminőséget az Open-Meteo. Az idő a helyi ${utcOffset} (${timezone}) időzóna szerint van megadva.`,
          },
        ],
      };
    }
    case "bg": {
      const inCity = `в ${name}`;
      return {
        paragraphs: [
          `Град ${name} се намира в ${regionLabel}, на географска ширина ${latLabel} и дължина ${lonLabel} (часова зона ${timezone}, ${utcOffset}). ${aurora}`,
          `Геомагнитната активност се определя от планетарния Kp-индекс, който е общ за цялата планета, но осезаемостта на магнитните бури зависи от географската ширина. На тази страница показваме Kp-индекса ${inCity}, прогнозата за 3 и 27 дни, нивото на бурята по скалата G, времето, изгрева и залеза на слънцето и качеството на въздуха — в реално време по данни на NOAA SWPC и Open-Meteo.`,
        ],
        faq: [
          {
            question: `Ще има ли магнитна буря ${inCity} днес?`,
            answer: `Текущото състояние на геомагнитното поле ${inCity} се обновява в реално време по данни на NOAA SWPC. Текущият Kp-индекс, нивото на бурята по скалата G и прогнозата за следващите 3 дни са показани по-горе на тази страница.`,
          },
          {
            question: `Може ли да се види северно сияние ${inCity}?`,
            answer: `${aurora} Координати на града: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Откъде идват данните за магнитните бури за ${genitive}?`,
            answer: `Данните за Kp-индекса и скалите G/R/S се предоставят от NOAA Space Weather Prediction Center, а времето и качеството на въздуха — от Open-Meteo. Часовете са показани в местната часова зона ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
    case "cs": {
      const inCity = `ve městě ${name}`;
      return {
        paragraphs: [
          `Město ${name} leží v ${regionLabel}, na zeměpisné šířce ${latLabel} a délce ${lonLabel} (časové pásmo ${timezone}, ${utcOffset}). ${aurora}`,
          `Geomagnetickou aktivitu určuje planetární Kp-index, který je společný pro celou planetu, ale to, jak silně jsou magnetické bouře pociťovány, závisí na zeměpisné šířce. Na této stránce zobrazujeme Kp-index ${inCity}, předpověď na 3 a 27 dní, úroveň bouře na škále G, počasí, východ a západ slunce a kvalitu ovzduší — v reálném čase podle dat NOAA SWPC a Open-Meteo.`,
        ],
        faq: [
          {
            question: `Bude dnes ${inCity} magnetická bouře?`,
            answer: `Aktuální stav geomagnetického pole ${inCity} se obnovuje v reálném čase podle dat NOAA SWPC. Aktuální Kp-index, úroveň bouře na škále G a předpověď na následující 3 dny jsou uvedeny výše na této stránce.`,
          },
          {
            question: `Je možné ${inCity} vidět polární záři?`,
            answer: `${aurora} Souřadnice města: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Odkud pocházejí data o magnetických bouřích pro ${genitive}?`,
            answer: `Data Kp-indexu a škál G/R/S poskytuje NOAA Space Weather Prediction Center, počasí a kvalitu ovzduší Open-Meteo. Časy jsou uvedeny v místním časovém pásmu ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
    case "en": {
      const inCity = `in ${name}`;
      return {
        paragraphs: [
          `${name} is located in ${regionLabel}, at latitude ${latLabel} and longitude ${lonLabel} (timezone ${timezone}, ${utcOffset}). ${aurora}`,
          `Geomagnetic activity is driven by the planetary Kp index, which is the same worldwide, but how strongly a magnetic storm is felt depends on latitude. On this page we show the Kp index ${inCity}, the 3- and 27-day forecast, the storm level on the G scale, the weather, sunrise and sunset, and air quality — in real time from NOAA SWPC and Open-Meteo.`,
        ],
        faq: [
          {
            question: `Will there be a magnetic storm ${inCity} today?`,
            answer: `The current state of the geomagnetic field ${inCity} is updated in real time using NOAA SWPC data. The current Kp index, the storm level on the G scale and the forecast for the next 3 days are shown above on this page.`,
          },
          {
            question: `Can you see the aurora ${inCity}?`,
            answer: `${aurora} City coordinates: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Where does the magnetic-storm data for ${name} come from?`,
            answer: `The Kp index and the G/R/S scales are provided by the NOAA Space Weather Prediction Center, while weather and air quality come from Open-Meteo. Times are shown in the local ${utcOffset} (${timezone}) timezone.`,
          },
        ],
      };
    }
    default: {
      // uk
      const inCity = `${prep}${locative}`;
      return {
        paragraphs: [
          `Місто ${name} розташоване на широті ${latLabel} і довготі ${lonLabel}; регіон — ${regionLabel} (часовий пояс ${timezone}, ${utcOffset}). ${aurora}`,
          `Геомагнітна активність визначається планетарним Kp-індексом, спільним для всієї планети, проте відчутність магнітних бур залежить від широти. На цій сторінці ми показуємо Kp-індекс ${inCity}, прогноз на 3 та 27 днів, рівень бурі за шкалою G, погоду, схід і захід сонця та якість повітря — у реальному часі за даними NOAA SWPC, Укргідрометцентру та Open-Meteo.`,
        ],
        faq: [
          {
            question: `Чи буде магнітна буря ${inCity} сьогодні?`,
            answer: `Актуальний стан геомагнітного поля ${inCity} оновлюється в реальному часі за даними NOAA SWPC. Поточний Kp-індекс, рівень бурі за шкалою G та прогноз на найближчі 3 дні наведені вище на цій сторінці.`,
          },
          {
            question: `Чи можна побачити полярне сяйво ${inCity}?`,
            answer: `${aurora} Координати міста: ${latLabel}, ${lonLabel}.`,
          },
          {
            question: `Звідки беруться дані про магнітні бурі для ${genitive}?`,
            answer: `Дані Kp-індексу та шкал G/R/S надає NOAA Space Weather Prediction Center, попередження — Укргідрометцентр, погоду й якість повітря — Open-Meteo. Час подано за місцевим поясом ${utcOffset} (${timezone}).`,
          },
        ],
      };
    }
  }
}
