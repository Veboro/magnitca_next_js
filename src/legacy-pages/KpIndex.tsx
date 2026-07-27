"use client";

import { useEffect } from "react";
import { useKpIndex, useNoaaScales } from "@/hooks/useSpaceWeather";
import type { KpEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Gauge, TrendingUp, Info, HelpCircle } from "lucide-react";
import type { SiteLocale } from "@/lib/locale";

type LegacyLocale = SiteLocale;

const copy = {
  uk: {
    pageTitle: "Kp індекс онлайн в режимі реального часу — прогноз магнітних бур",
    pageDescription:
      "Kp індекс зараз у реальному часі. Поточне значення, графік за 24 години та 3-денний прогноз геомагнітної активності. Дані NOAA оновлюються щохвилини.",
    heroTitle: "Kp індекс сьогодні",
    heroText:
      "Планетарний індекс геомагнітної активності в реальному часі. Поточне значення, графік за останні 24 години та 3-денний прогноз від NOAA SWPC.",
    currentKpLabel: "Поточний Kp індекс",
    currentState: "Поточний стан",
    chartAria: "Графік Kp індексу за 24 години",
    chartTitle: "Kp індекс за останні",
    hours: "год",
    forecastAria: "3-денний прогноз Kp індексу",
    forecastTitle: "Прогноз Kp індексу на 3 дні (по 3-годинних інтервалах)",
    loading: "Завантаження прогнозу...",
    unavailable: "Дані прогнозу недоступні.",
    maxKp: "макс. Kp",
    scaleAria: "Шкала Kp індексу",
    scaleTitle: "Шкала Kp індексу (0–9)",
    seoAria: "Про Kp індекс",
    seoHeading: "Що таке Kp індекс і чому він важливий?",
    seoText1:
      "<strong>Kp індекс</strong> (планетарний K-індекс) — це глобальний показник геомагнітної активності Землі, який вимірюється за шкалою від 0 до 9. Він розраховується на основі даних мережі магнітометрів, розташованих по всьому світу, і оновлюється кожні 3 години. Значення Kp від 0 до 3 відповідає спокійним умовам, Kp 4 свідчить про нестабільну геомагнітну обстановку, а Kp≥5 означає початок геомагнітної бурі за шкалою NOAA (G1–G5).",
    seoText2:
      "Kp індекс використовується для оцінки впливу сонячної активності на технології та здоров'я людей. При підвищеному Kp можливі збої GPS-навігації, перебої радіозв'язку, а метеочутливі люди можуть відчувати головний біль, втомлюваність та порушення сну. На цій сторінці ви знайдете поточне значення Kp індексу, графік його зміни за останні 24 години та детальний 3-денний прогноз від NOAA Space Weather Prediction Center.",
    faqAria: "Часті питання про Kp індекс",
    faqTitle: "Часті питання",
    gScale: "G-шкала",
    rScale: "R-шкала",
    sScale: "S-шкала",
    kpLevels: [
      { kp: "0–1", status: "Спокійно", color: "bg-storm-quiet", description: "Мінімальна геомагнітна активність. Жодного впливу на технології та здоров'я." },
      { kp: "2–3", status: "Низька активність", color: "bg-storm-quiet", description: "Незначні коливання магнітного поля. Можливе слабке полярне сяйво на високих широтах." },
      { kp: "4", status: "Нестабільно", color: "bg-storm-minor", description: "Помітна геомагнітна активність. Метеочутливі люди можуть відчувати легкий дискомфорт." },
      { kp: "5 (G1)", status: "Мала буря", color: "bg-storm-moderate", description: "Слабка геомагнітна буря. Можливі збої GPS, головний біль у чутливих людей." },
      { kp: "6 (G2)", status: "Помірна буря", color: "bg-storm-moderate", description: "Помірна буря. Проблеми з HF-радіо, полярне сяйво видно на середніх широтах." },
      { kp: "7 (G3)", status: "Сильна буря", color: "bg-storm-strong", description: "Сильна буря. Перебої в енергомережах, супутникова навігація нестабільна." },
      { kp: "8 (G4)", status: "Дуже сильна", color: "bg-storm-severe", description: "Серйозна буря. Масштабні збої GPS та радіозв'язку, ризик для енергосистем." },
      { kp: "9 (G5)", status: "Екстремальна", color: "bg-storm-severe", description: "Екстремальна буря. Можливі аварії енергомереж, повне порушення радіозв'язку." },
    ],
    faqItems: [
      { q: "Що таке Kp індекс?", a: "Kp індекс — це планетарний індекс геомагнітної активності за шкалою від 0 до 9. Він розраховується кожні 3 години на основі даних магнітометрів, розташованих по всьому світу. Значення Kp≥5 означає геомагнітну бурю." },
      { q: "Як часто оновлюється Kp індекс?", a: "На нашому сайті Kp індекс оновлюється щохвилини на основі оціночних (estimated) даних NOAA SWPC. Офіційний Kp розраховується кожні 3 години." },
      { q: "Як Kp індекс впливає на здоров'я?", a: "При Kp≥4 метеочутливі люди можуть відчувати головний біль, втому, перепади артеріального тиску та порушення сну. При Kp≥6 ці симптоми посилюються і можуть торкнутися ширшого кола людей." },
      { q: "Що означає G-шкала?", a: "G-шкала NOAA (G1–G5) класифікує геомагнітні бурі за інтенсивністю. G1 відповідає Kp=5, G2 — Kp=6, G3 — Kp=7, G4 — Kp=8, G5 — Kp=9." },
      { q: "Де можна побачити прогноз Kp індексу?", a: "На цій сторінці ви знайдете 3-денний прогноз Kp індексу по 3-годинних інтервалах від NOAA Space Weather Prediction Center, а також поточне значення та історію за 24 години." },
    ],
  },
  ru: {
    pageTitle: "Kp индекс онлайн в реальном времени — прогноз магнитных бурь",
    pageDescription:
      "Kp индекс сейчас в реальном времени. Текущее значение, график за 24 часа и 3-дневный прогноз геомагнитной активности. Данные NOAA обновляются каждую минуту.",
    heroTitle: "Kp индекс сегодня",
    heroText:
      "Планетарный индекс геомагнитной активности в реальном времени. Текущее значение, график за последние 24 часа и 3-дневный прогноз от NOAA SWPC.",
    currentKpLabel: "Текущий Kp индекс",
    currentState: "Текущее состояние",
    chartAria: "График Kp индекса за 24 часа",
    chartTitle: "Kp индекс за последние",
    hours: "ч",
    forecastAria: "3-дневный прогноз Kp индекса",
    forecastTitle: "Прогноз Kp индекса на 3 дня (по 3-часовым интервалам)",
    loading: "Загрузка прогноза...",
    unavailable: "Данные прогноза недоступны.",
    maxKp: "макс. Kp",
    scaleAria: "Шкала Kp индекса",
    scaleTitle: "Шкала Kp индекса (0–9)",
    seoAria: "О Kp индексе",
    seoHeading: "Что такое Kp индекс и почему он важен?",
    seoText1:
      "<strong>Kp индекс</strong> (планетарный K-индекс) — это глобальный показатель геомагнитной активности Земли, который измеряется по шкале от 0 до 9. Он рассчитывается на основе данных сети магнитометров, расположенных по всему миру, и обновляется каждые 3 часа. Значения Kp от 0 до 3 соответствуют спокойным условиям, Kp 4 указывает на нестабильную геомагнитную обстановку, а Kp≥5 означает начало геомагнитной бури по шкале NOAA (G1–G5).",
    seoText2:
      "Kp индекс используется для оценки влияния солнечной активности на технологии и самочувствие людей. При повышенном Kp возможны сбои GPS-навигации, перебои радиосвязи, а метеочувствительные люди могут ощущать головную боль, усталость и нарушения сна. На этой странице вы найдете текущее значение Kp индекса, график его изменения за последние 24 часа и детальный 3-дневный прогноз от NOAA Space Weather Prediction Center.",
    faqAria: "Частые вопросы о Kp индексе",
    faqTitle: "Частые вопросы",
    gScale: "G-шкала",
    rScale: "R-шкала",
    sScale: "S-шкала",
    kpLevels: [
      { kp: "0–1", status: "Спокойно", color: "bg-storm-quiet", description: "Минимальная геомагнитная активность. Никакого влияния на технологии и здоровье." },
      { kp: "2–3", status: "Низкая активность", color: "bg-storm-quiet", description: "Незначительные колебания магнитного поля. Возможно слабое полярное сияние на высоких широтах." },
      { kp: "4", status: "Нестабильно", color: "bg-storm-minor", description: "Заметная геомагнитная активность. Метеочувствительные люди могут ощущать легкий дискомфорт." },
      { kp: "5 (G1)", status: "Малая буря", color: "bg-storm-moderate", description: "Слабая геомагнитная буря. Возможны сбои GPS, головная боль у чувствительных людей." },
      { kp: "6 (G2)", status: "Умеренная буря", color: "bg-storm-moderate", description: "Умеренная буря. Проблемы с HF-радио, полярное сияние видно на средних широтах." },
      { kp: "7 (G3)", status: "Сильная буря", color: "bg-storm-strong", description: "Сильная буря. Перебои в энергосетях, спутниковая навигация нестабильна." },
      { kp: "8 (G4)", status: "Очень сильная", color: "bg-storm-severe", description: "Серьезная буря. Масштабные сбои GPS и радиосвязи, риск для энергосистем." },
      { kp: "9 (G5)", status: "Экстремальная", color: "bg-storm-severe", description: "Экстремальная буря. Возможны аварии энергосетей, полное нарушение радиосвязи." },
    ],
    faqItems: [
      { q: "Что такое Kp индекс?", a: "Kp индекс — это планетарный индекс геомагнитной активности по шкале от 0 до 9. Он рассчитывается каждые 3 часа на основе данных магнитометров, расположенных по всему миру. Значение Kp≥5 означает геомагнитную бурю." },
      { q: "Как часто обновляется Kp индекс?", a: "На нашем сайте Kp индекс обновляется каждую минуту на основе оценочных (estimated) данных NOAA SWPC. Официальный Kp рассчитывается каждые 3 часа." },
      { q: "Как Kp индекс влияет на здоровье?", a: "При Kp≥4 метеочувствительные люди могут ощущать головную боль, усталость, перепады артериального давления и нарушения сна. При Kp≥6 эти симптомы усиливаются и могут затронуть более широкий круг людей." },
      { q: "Что означает G-шкала?", a: "G-шкала NOAA (G1–G5) классифицирует геомагнитные бури по интенсивности. G1 соответствует Kp=5, G2 — Kp=6, G3 — Kp=7, G4 — Kp=8, G5 — Kp=9." },
      { q: "Где можно посмотреть прогноз Kp индекса?", a: "На этой странице вы найдете 3-дневный прогноз Kp индекса по 3-часовым интервалам от NOAA Space Weather Prediction Center, а также текущее значение и историю за 24 часа." },
    ],
  },
  pl: {
    pageTitle: "Indeks Kp online w czasie rzeczywistym — prognoza burz magnetycznych",
    pageDescription:
      "Aktualny indeks Kp w czasie rzeczywistym. Bieżąca wartość, wykres z ostatnich 24 godzin i 3-dniowa prognoza aktywności geomagnetycznej na podstawie danych NOAA.",
    heroTitle: "Indeks Kp dzisiaj",
    heroText:
      "Planetarny indeks aktywności geomagnetycznej w czasie rzeczywistym. Aktualna wartość, wykres z ostatnich 24 godzin i 3-dniowa prognoza NOAA SWPC.",
    currentKpLabel: "Aktualny indeks Kp",
    currentState: "Bieżąca sytuacja",
    chartAria: "Wykres indeksu Kp z ostatnich 24 godzin",
    chartTitle: "Indeks Kp z ostatnich",
    hours: "godz.",
    forecastAria: "3-dniowa prognoza indeksu Kp",
    forecastTitle: "Prognoza indeksu Kp na 3 dni (co 3 godziny)",
    loading: "Ładowanie prognozy...",
    unavailable: "Dane prognozy są chwilowo niedostępne.",
    maxKp: "maks. Kp",
    scaleAria: "Skala indeksu Kp",
    scaleTitle: "Skala indeksu Kp (0–9)",
    seoAria: "O indeksie Kp",
    seoHeading: "Czym jest indeks Kp i dlaczego ma znaczenie?",
    seoText1:
      "<strong>Indeks Kp</strong> to globalny wskaźnik aktywności geomagnetycznej Ziemi w skali od 0 do 9. Powstaje na podstawie pomiarów z sieci magnetometrów rozmieszczonych na świecie i jest wykorzystywany do oceny siły zaburzeń pola magnetycznego.",
    seoText2:
      "Im wyższy indeks Kp, tym większe prawdopodobieństwo zakłóceń w łączności, nawigacji satelitarnej i gorszego samopoczucia u osób wrażliwych na pogodę. Na tej stronie znajdziesz aktualną wartość indeksu Kp, wykres jego zmian oraz 3-dniową prognozę NOAA.",
    faqAria: "Najczęstsze pytania o indeks Kp",
    faqTitle: "Najczęstsze pytania",
    gScale: "Skala G",
    rScale: "Skala R",
    sScale: "Skala S",
    kpLevels: [
      { kp: "0–1", status: "Spokojnie", color: "bg-storm-quiet", description: "Minimalna aktywność geomagnetyczna, bez zauważalnego wpływu na technologie i samopoczucie." },
      { kp: "2–3", status: "Niska aktywność", color: "bg-storm-quiet", description: "Niewielkie wahania pola magnetycznego. Zwykle bez odczuwalnych skutków dla większości osób." },
      { kp: "4", status: "Niestabilnie", color: "bg-storm-minor", description: "Podwyższona aktywność geomagnetyczna. Osoby meteowrażliwe mogą odczuwać lekki dyskomfort." },
      { kp: "5 (G1)", status: "Słaba burza", color: "bg-storm-moderate", description: "Słaba burza magnetyczna. Możliwe drobne zakłócenia GPS i gorsze samopoczucie u części osób." },
      { kp: "6 (G2)", status: "Umiarkowana burza", color: "bg-storm-moderate", description: "Umiarkowana burza. Ryzyko zakłóceń radiowych i większego wpływu na osoby wrażliwe." },
      { kp: "7 (G3)", status: "Silna burza", color: "bg-storm-strong", description: "Silna burza. Możliwe wyraźniejsze problemy z nawigacją, łącznością i energią." },
      { kp: "8 (G4)", status: "Bardzo silna", color: "bg-storm-severe", description: "Bardzo silna burza z podwyższonym ryzykiem zakłóceń technologicznych." },
      { kp: "9 (G5)", status: "Ekstremalna", color: "bg-storm-severe", description: "Ekstremalna burza geomagnetyczna o największym potencjalnym wpływie na infrastrukturę." },
    ],
    faqItems: [
      { q: "Czym jest indeks Kp?", a: "Indeks Kp to planetarny wskaźnik aktywności geomagnetycznej od 0 do 9. Im wyższa wartość, tym silniejsze zaburzenie pola magnetycznego Ziemi." },
      { q: "Jak często aktualizuje się indeks Kp?", a: "Oficjalny indeks Kp publikowany jest co 3 godziny, ale na stronie mogą pojawiać się również wartości szacunkowe aktualizowane częściej." },
      { q: "Jak indeks Kp wpływa na samopoczucie?", a: "Przy podwyższonym Kp część osób może odczuwać ból głowy, zmęczenie, rozdrażnienie czy problemy ze snem. Nie dotyczy to wszystkich, ale zależność bywa zauważalna." },
      { q: "Co oznacza skala G?", a: "Skala G NOAA opisuje siłę burzy geomagnetycznej od G1 do G5. Każdy poziom odpowiada określonemu przedziałowi wartości Kp." },
      { q: "Gdzie sprawdzić prognozę indeksu Kp?", a: "Na tej stronie znajdziesz 3-dniową prognozę Kp od NOAA, a także bieżącą wartość i wykres zmian z ostatnich godzin." },
    ],
  },
} as const;

const localizedCopy = {
  ...copy,
  ro: {
    ...copy.pl,
    pageTitle: "Indice Kp online în timp real — prognoza furtunilor magnetice",
    pageDescription:
      "Indicele Kp acum în timp real. Valoarea curentă, graficul pentru ultimele 24 de ore și prognoza activității geomagnetice pe 3 zile.",
    heroTitle: "Indicele Kp astăzi",
    heroText:
      "Indicele planetar al activității geomagnetice în timp real. Valoarea curentă, graficul pentru ultimele 24 de ore și prognoza NOAA SWPC pe 3 zile.",
    currentKpLabel: "Indice Kp curent",
    currentState: "Starea curentă",
    chartAria: "Graficul indicelui Kp pentru 24 de ore",
    chartTitle: "Indicele Kp în ultimele",
    hours: "ore",
    forecastAria: "Prognoza indicelui Kp pe 3 zile",
    forecastTitle: "Prognoza indicelui Kp pe 3 zile (intervale de 3 ore)",
    loading: "Se încarcă prognoza...",
    unavailable: "Datele prognozei sunt indisponibile.",
    maxKp: "max. Kp",
    scaleAria: "Scara indicelui Kp",
    scaleTitle: "Scara indicelui Kp (0-9)",
    seoAria: "Despre indicele Kp",
    seoHeading: "Ce este indicele Kp și de ce este important?",
    seoText1:
      "<strong>Indicele Kp</strong> este un indicator global al activității geomagnetice a Pământului pe o scară de la 0 la 9. Valorile 0-3 indică un fond calm, Kp 4 arată instabilitate, iar Kp 5 sau mai mult înseamnă furtună geomagnetică.",
    seoText2:
      "Indicele Kp ajută la evaluarea influenței activității solare asupra comunicațiilor, navigației și stării de bine a persoanelor meteosensibile. Pe această pagină vezi valoarea curentă, graficul și prognoza pe 3 zile.",
    faqAria: "Întrebări frecvente despre indicele Kp",
    faqTitle: "Întrebări frecvente",
    gScale: "Scara G",
    rScale: "Scara R",
    sScale: "Scara S",
    kpLevels: [
      { kp: "0-1", status: "Calm", color: "bg-storm-quiet", description: "Activitate geomagnetică minimă, fără impact vizibil." },
      { kp: "2-3", status: "Activitate scăzută", color: "bg-storm-quiet", description: "Oscilații mici ale câmpului magnetic." },
      { kp: "4", status: "Instabil", color: "bg-storm-minor", description: "Activitate ridicată; persoanele sensibile pot simți disconfort ușor." },
      { kp: "5 (G1)", status: "Furtună slabă", color: "bg-storm-moderate", description: "Furtună geomagnetică slabă, posibil impact minor." },
      { kp: "6 (G2)", status: "Furtună moderată", color: "bg-storm-moderate", description: "Risc mai mare de perturbări și reacții la meteosensibili." },
      { kp: "7 (G3)", status: "Furtună puternică", color: "bg-storm-strong", description: "Perturbări mai vizibile ale câmpului geomagnetic." },
      { kp: "8 (G4)", status: "Foarte puternică", color: "bg-storm-severe", description: "Furtună severă cu potențial impact tehnologic." },
      { kp: "9 (G5)", status: "Extremă", color: "bg-storm-severe", description: "Furtună geomagnetică extremă." },
    ],
    faqItems: [
      { q: "Ce este indicele Kp?", a: "Indicele Kp măsoară activitatea geomagnetică globală pe o scară de la 0 la 9." },
      { q: "Când începe o furtună magnetică?", a: "De obicei, furtuna geomagnetică începe de la Kp 5, ceea ce corespunde nivelului G1 pe scara NOAA." },
      { q: "Cât de des se actualizează datele?", a: "Valorile estimate sunt actualizate frecvent, iar prognoza NOAA este revizuită regulat." },
      { q: "Poate Kp influența starea de bine?", a: "Unele persoane sensibile pot simți oboseală, dureri de cap sau somn mai agitat în perioadele cu activitate ridicată." },
      { q: "Unde văd prognoza?", a: "Pe această pagină este afișată prognoza Kp pe 3 zile, împreună cu valoarea curentă și graficul." },
    ],
  },
  hu: {
    ...copy.pl,
    pageTitle: "Kp-index online valós időben — mágneses vihar előrejelzés",
    pageDescription:
      "Aktuális Kp-index valós időben. Jelenlegi érték, 24 órás grafikon és 3 napos geomágneses aktivitási előrejelzés NOAA adatok alapján.",
    heroTitle: "Kp-index ma",
    heroText:
      "A planetáris geomágneses aktivitás valós idejű mutatója. Aktuális érték, az elmúlt 24 óra grafikonja és NOAA SWPC 3 napos előrejelzés.",
    currentKpLabel: "Aktuális Kp-index",
    currentState: "Aktuális állapot",
    chartAria: "Kp-index grafikon 24 órára",
    chartTitle: "Kp-index az elmúlt",
    hours: "óra",
    forecastAria: "3 napos Kp-index előrejelzés",
    forecastTitle: "Kp-index előrejelzés 3 napra (3 órás intervallumok)",
    loading: "Előrejelzés betöltése...",
    unavailable: "Az előrejelzési adatok nem elérhetők.",
    maxKp: "max. Kp",
    scaleAria: "Kp-index skála",
    scaleTitle: "Kp-index skála (0-9)",
    seoAria: "A Kp-indexről",
    seoHeading: "Mi az a Kp-index és miért fontos?",
    seoText1:
      "A <strong>Kp-index</strong> a Föld geomágneses aktivitásának globális mutatója 0 és 9 közötti skálán. A 0-3 érték nyugodt, a 4 ingadozó állapotot jelez, az 5 vagy magasabb érték pedig geomágneses vihart jelent.",
    seoText2:
      "A Kp-index segít megérteni, hogyan hathat a naptevékenység a kommunikációra, navigációra és az időjárásra érzékeny emberek közérzetére. Ezen az oldalon az aktuális értéket, a grafikonokat és a 3 napos előrejelzést találod.",
    faqAria: "Gyakori kérdések a Kp-indexről",
    faqTitle: "Gyakori kérdések",
    gScale: "G-skála",
    rScale: "R-skála",
    sScale: "S-skála",
    kpLevels: [
      { kp: "0-1", status: "Nyugodt", color: "bg-storm-quiet", description: "Minimális geomágneses aktivitás, látható hatás nélkül." },
      { kp: "2-3", status: "Alacsony aktivitás", color: "bg-storm-quiet", description: "Kisebb mágneses ingadozások, általában érezhető hatás nélkül." },
      { kp: "4", status: "Ingadozó", color: "bg-storm-minor", description: "Emelkedett aktivitás; érzékeny embereknél enyhe kellemetlenség lehet." },
      { kp: "5 (G1)", status: "Gyenge vihar", color: "bg-storm-moderate", description: "Gyenge geomágneses vihar, kisebb technikai és közérzeti hatással." },
      { kp: "6 (G2)", status: "Mérsékelt vihar", color: "bg-storm-moderate", description: "Nagyobb esély rádiózavarokra és érzékenyebb reakciókra." },
      { kp: "7 (G3)", status: "Erős vihar", color: "bg-storm-strong", description: "Erős zavarok, navigációs és kommunikációs hatásokkal." },
      { kp: "8 (G4)", status: "Nagyon erős", color: "bg-storm-severe", description: "Súlyos vihar fokozott technológiai kockázattal." },
      { kp: "9 (G5)", status: "Extrém", color: "bg-storm-severe", description: "Extrém geomágneses vihar a legnagyobb potenciális hatással." },
    ],
    faqItems: [
      { q: "Mi az a Kp-index?", a: "A Kp-index a globális geomágneses aktivitás 0 és 9 közötti mutatója. Minél magasabb az érték, annál erősebb a Föld mágneses terének zavara." },
      { q: "Mikor kezdődik mágneses vihar?", a: "Általában Kp 5-től beszélünk geomágneses viharról, ami a NOAA G1 szintnek felel meg." },
      { q: "Milyen gyakran frissül az előrejelzés?", a: "A becsült értékek gyakran frissülnek, a NOAA előrejelzések pedig rendszeresen módosulhatnak." },
      { q: "Hathat a Kp-index a közérzetre?", a: "Egyes érzékeny embereknél magasabb Kp mellett fáradtság, fejfájás vagy nyugtalanabb alvás előfordulhat." },
      { q: "Hol látható a Kp-előrejelzés?", a: "Ezen az oldalon látható a 3 napos Kp-előrejelzés, az aktuális érték és az elmúlt órák grafikonja." },
    ],
  },
  bg: {
    ...copy.pl,
    pageTitle: "Kp-индекс онлайн в реално време — прогноза за магнитни бури",
    pageDescription:
      "Актуален Kp-индекс в реално време. Текуща стойност, 24-часова графика и 3-дневна прогноза за геомагнитната активност по данни на NOAA.",
    heroTitle: "Kp-индекс днес",
    heroText:
      "Планетарен показател за геомагнитната активност в реално време. Текуща стойност, графика за последните 24 часа и 3-дневна прогноза от NOAA SWPC.",
    currentKpLabel: "Текущ Kp-индекс",
    currentState: "Текущо състояние",
    chartAria: "Графика на Kp-индекса за 24 часа",
    chartTitle: "Kp-индекс за последните",
    hours: "ч",
    forecastAria: "3-дневна прогноза за Kp-индекса",
    forecastTitle: "Прогноза за Kp-индекса за 3 дни (на 3-часови интервали)",
    loading: "Зареждане на прогнозата...",
    unavailable: "Данните за прогнозата не са налични.",
    maxKp: "макс. Kp",
    scaleAria: "Скала на Kp-индекса",
    scaleTitle: "Скала на Kp-индекса (0-9)",
    seoAria: "За Kp-индекса",
    seoHeading: "Какво е Kp-индексът и защо е важен?",
    seoText1:
      "<strong>Kp-индексът</strong> е глобален показател за геомагнитната активност на Земята по скала от 0 до 9. Стойностите 0-3 означават спокойни условия, 4 показва неустойчиво състояние, а 5 или повече означава геомагнитна буря.",
    seoText2:
      "Kp-индексът помага да се разбере как слънчевата активност може да влияе върху комуникациите, навигацията и самочувствието на метеочувствителните хора. На тази страница ще намерите текущата стойност, графиките и 3-дневната прогноза.",
    faqAria: "Често задавани въпроси за Kp-индекса",
    faqTitle: "Често задавани въпроси",
    gScale: "G-скала",
    rScale: "R-скала",
    sScale: "S-скала",
    kpLevels: [
      { kp: "0-1", status: "Спокойно", color: "bg-storm-quiet", description: "Минимална геомагнитна активност без видимо въздействие." },
      { kp: "2-3", status: "Ниска активност", color: "bg-storm-quiet", description: "Малки колебания на магнитното поле, обикновено без осезаемо въздействие." },
      { kp: "4", status: "Неустойчиво", color: "bg-storm-minor", description: "Повишена активност; чувствителните хора може да усетят лек дискомфорт." },
      { kp: "5 (G1)", status: "Слаба буря", color: "bg-storm-moderate", description: "Слаба геомагнитна буря с незначително технологично и здравно въздействие." },
      { kp: "6 (G2)", status: "Умерена буря", color: "bg-storm-moderate", description: "По-голяма вероятност за радиосмущения и по-осезаеми реакции." },
      { kp: "7 (G3)", status: "Силна буря", color: "bg-storm-strong", description: "Силни смущения с въздействие върху навигацията и комуникациите." },
      { kp: "8 (G4)", status: "Много силна", color: "bg-storm-severe", description: "Тежка буря с повишен технологичен риск." },
      { kp: "9 (G5)", status: "Екстремална", color: "bg-storm-severe", description: "Екстремална геомагнитна буря с най-голямо потенциално въздействие." },
    ],
    faqItems: [
      { q: "Какво е Kp-индексът?", a: "Kp-индексът е планетарен показател за геомагнитната активност по скала от 0 до 9. Колкото по-висока е стойността, толкова по-силно е смущението на магнитното поле на Земята." },
      { q: "Кога започва магнитна буря?", a: "Обикновено говорим за геомагнитна буря от Kp 5, което съответства на ниво G1 по скалата на NOAA." },
      { q: "Колко често се обновява прогнозата?", a: "Прогнозните стойности се обновяват често, а прогнозите на NOAA се актуализират редовно." },
      { q: "Може ли Kp-индексът да влияе на самочувствието?", a: "При някои чувствителни хора при по-висок Kp може да се появи умора, главоболие или по-неспокоен сън." },
      { q: "Къде мога да видя прогнозата за Kp?", a: "На тази страница са показани 3-дневната прогноза за Kp, текущата стойност и графиката за последните часове." },
    ],
  },
  en: {
    ...copy.uk,
    pageTitle: "Kp index online in real time — magnetic storm forecast",
    pageDescription:
      "Current Kp index in real time. Live value, 24-hour chart and 3-day geomagnetic activity forecast based on NOAA data.",
    heroTitle: "Kp index today",
    heroText:
      "Planetary geomagnetic activity index in real time. Current value, 24-hour history and 3-day NOAA SWPC forecast.",
    currentKpLabel: "Current Kp index",
    currentState: "Current state",
    chartAria: "Kp index chart for the last 24 hours",
    chartTitle: "Kp index for the last",
    hours: "h",
    forecastAria: "3-day Kp index forecast",
    forecastTitle: "3-day Kp index forecast (3-hour intervals)",
    loading: "Loading forecast...",
    unavailable: "Forecast data is unavailable.",
    maxKp: "max Kp",
    scaleAria: "Kp index scale",
    scaleTitle: "Kp index scale (0-9)",
    seoAria: "About the Kp index",
    seoHeading: "What is the Kp index and why does it matter?",
    seoText1:
      "<strong>The Kp index</strong> is a global measure of Earth's geomagnetic activity on a scale from 0 to 9. Values from 0 to 3 are generally calm, Kp 4 is unsettled, and Kp 5 or higher indicates a geomagnetic storm on the NOAA G scale.",
    seoText2:
      "The Kp index helps estimate the strength of space weather effects. Higher Kp values can affect satellite navigation and radio communication, and some weather-sensitive people may feel fatigue, headache or sleep disruption.",
    faqAria: "Kp index FAQ",
    faqTitle: "FAQ",
    gScale: "G scale",
    rScale: "R scale",
    sScale: "S scale",
    kpLevels: [
      { kp: "0-1", status: "Calm", color: "bg-storm-quiet", description: "Minimal geomagnetic activity." },
      { kp: "2-3", status: "Low activity", color: "bg-storm-quiet", description: "Small magnetic field variations." },
      { kp: "4", status: "Unsettled", color: "bg-storm-minor", description: "Elevated activity; sensitive people may notice mild discomfort." },
      { kp: "5 (G1)", status: "Minor storm", color: "bg-storm-moderate", description: "Minor geomagnetic storm." },
      { kp: "6 (G2)", status: "Moderate storm", color: "bg-storm-moderate", description: "Moderate storm with stronger potential effects." },
      { kp: "7 (G3)", status: "Strong storm", color: "bg-storm-strong", description: "Strong geomagnetic storm." },
      { kp: "8 (G4)", status: "Severe", color: "bg-storm-severe", description: "Severe storm with significant space weather impact." },
      { kp: "9 (G5)", status: "Extreme", color: "bg-storm-severe", description: "Extreme geomagnetic storm." },
    ],
    faqItems: [
      { q: "What is the Kp index?", a: "The Kp index is a planetary measure of geomagnetic activity from 0 to 9." },
      { q: "When does a magnetic storm begin?", a: "A geomagnetic storm usually begins at Kp 5, which corresponds to NOAA G1." },
      { q: "How often is the forecast updated?", a: "Forecasts are updated regularly by NOAA and may change throughout the day." },
      { q: "Can Kp affect wellbeing?", a: "Some sensitive people report fatigue, headaches or poorer sleep during higher geomagnetic activity." },
      { q: "Where can I see the forecast?", a: "This page shows the current value, recent chart and 3-day Kp forecast." },
    ],
  },
};

const getPageTimeZone = (locale: LegacyLocale) =>
  locale === "pl" ? "Europe/Warsaw" : locale === "ro" ? "Europe/Chisinau" : locale === "hu" ? "Europe/Budapest" : locale === "bg" ? "Europe/Sofia" : locale === "en" ? "UTC" : "Europe/Kyiv";

const todayStr = (localeTag: string, timeZone: string) =>
  new Date().toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  });

interface KpIndexProps {
  locale?: LegacyLocale;
  initialKp?: KpEntry[] | null;
  initialScales?: NoaaScales | null;
}

const KpIndex = ({ locale = "uk", initialKp, initialScales }: KpIndexProps) => {
  const t = localizedCopy[locale];
  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-MD" : locale === "hu" ? "hu-HU" : locale === "bg" ? "bg-BG" : locale === "en" ? "en-US" : "uk-UA";
  const timeZone = getPageTimeZone(locale);
  const today = todayStr(localeTag, timeZone);

  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: scales } = useNoaaScales(initialScales ?? undefined);
  const { data: forecast, isLoading: forecastLoading } = useKpForecast();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const kpRound = Math.min(9, Math.max(0, Math.round(latestKp)));

  // Sample every 10th point for smoother chart
  const sampled = kpData?.filter((_, i) => i % 10 === 0) ?? [];
  const chartData = sampled.map((d) => ({
    time: new Date(d.time_tag).toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", timeZone }),
    kp: d.kp,
  }));

  // Calculate actual time range for the title
  const chartHours = kpData && kpData.length >= 2
    ? Math.round((new Date(kpData[kpData.length - 1].time_tag).getTime() - new Date(kpData[0].time_tag).getTime()) / 3600000)
    : 0;

  // JSON-LD FAQ
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="official-home min-h-screen">
      <main className="mx-auto max-w-[1180px] px-2 pb-10 pt-4 sm:px-6 lg:px-0" role="main">
        <div className="official-home-shell space-y-8 px-2 py-5 sm:px-6 lg:px-8">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        {/* Hero */}
        <header className="space-y-2 border-b border-border/60 pb-5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {t.heroTitle}, {today}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            {t.heroText}
          </p>
        </header>

        {/* Current Kp + Gauge */}
        <section className="grid gap-6 md:grid-cols-2" aria-label={t.currentKpLabel}>
          <KpIndexGauge />
          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.currentState}
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl font-bold text-foreground text-glow-cyan">
                  {latestKp.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm">/ 9.0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.kpLevels[Math.min(kpRound, 7)]?.description}
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground/70 font-mono">
                <span>{t.gScale}: G{scales?.g?.Scale ?? 0}</span>
                <span>{t.rScale}: R{scales?.r?.Scale ?? 0}</span>
                <span>{t.sScale}: S{scales?.s?.Scale ?? 0}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="md:hidden">
          <MobileAdsenseSlot />
        </div>

        {/* 24h Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.chartAria}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.chartTitle} {chartHours > 0 ? `${chartHours} ${t.hours}` : t.hours}
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "hsl(36, 20%, 10%)" }}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis
                  domain={[0, 9]}
                  tick={{ fontSize: 10, fill: "hsl(36, 20%, 10%)" }}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "G1", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                <Line type="monotone" dataKey="kp" stroke="hsl(35, 100%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 3-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.forecastAria}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.forecastTitle}
            </h2>
          </div>
          {forecastLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">{t.loading}</p>
          ) : forecast && forecast.length > 0 ? (() => {
            // Filter to today + future, then group by date
            const todayDate = new Date();
            const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
            const filtered = forecast.filter((row) => {
              const d = new Date(row.time_tag + "Z");
              const localStr = d.toLocaleDateString("sv-SE", { timeZone });
              return localStr >= todayKey;
            });
            const grouped = new Map<string, typeof forecast>();
            filtered.forEach((row) => {
              const dateKey = new Date(row.time_tag + "Z").toLocaleDateString(localeTag, {
                weekday: "short", day: "numeric", month: "short", timeZone,
              });
              if (!grouped.has(dateKey)) grouped.set(dateKey, []);
              grouped.get(dateKey)!.push(row);
            });
            const days = Array.from(grouped.entries()).slice(0, 3);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {days.map(([dateLabel, rows]) => {
                  const maxKp = Math.max(...rows.map((r) => r.kp));
                  const maxKpRound = Math.min(9, Math.max(0, Math.round(maxKp)));
                  return (
                    <div key={dateLabel} className="rounded-md border border-border/30 bg-muted/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-medium text-foreground">{dateLabel}</span>
                        <span className={cn(
                          "text-[10px] font-mono px-1.5 py-0.5 rounded",
                          maxKpRound >= 5 ? "bg-storm-severe/20 text-storm-severe" :
                          maxKpRound >= 4 ? "bg-storm-moderate/20 text-storm-moderate" :
                          "bg-storm-quiet/20 text-storm-quiet"
                        )}>
                          {t.maxKp} {maxKp.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {rows.map((row, j) => {
                          const kpVal = Math.min(9, Math.max(0, Math.round(row.kp)));
                          return (
                            <div key={j} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-mono">
                                {new Date(row.time_tag + "Z").toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone })}
                              </span>
                              <div className="flex-1 mx-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    kpVal >= 5 ? "bg-storm-severe" :
                                    kpVal >= 4 ? "bg-storm-moderate" :
                                    kpVal >= 2 ? "bg-storm-minor" :
                                    "bg-storm-quiet"
                                  )}
                                  style={{ width: `${(row.kp / 9) * 100}%` }}
                                />
                              </div>
                              <span className={cn(
                                "font-mono font-bold w-8 text-right",
                                kpVal >= 5 ? "text-storm-severe" :
                                kpVal >= 4 ? "text-storm-moderate" :
                                "text-muted-foreground"
                              )}>
                                {row.kp.toFixed(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })() : (
            <p className="text-sm text-muted-foreground">{t.unavailable}</p>
          )}
        </section>

        {/* Kp Levels Table */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.scaleAria}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t.scaleTitle}
          </h2>
          <div className="grid gap-2">
            {t.kpLevels.map((level) => (
              <div key={level.kp} className="flex items-start gap-3 rounded-md border border-border/20 bg-muted/20 p-3">
                <span className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", level.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">Kp {level.kp}</span>
                    <span className="text-xs text-muted-foreground">— {level.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Text */}
        <section className="rounded-lg border border-border/50 bg-card p-6 text-sm leading-relaxed text-muted-foreground" aria-label={t.seoAria}>
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.seoHeading}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t.seoText1 }} />
          <p>{t.seoText2}</p>
        </section>

        {/* FAQ */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.faqAria}>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.faqTitle}
            </h2>
          </div>
          <div className="space-y-4">
            {t.faqItems.map((item, i) => (
              <details key={i} className="group border-b border-border/20 pb-3 last:border-0">
                <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default KpIndex;
