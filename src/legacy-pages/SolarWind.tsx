"use client";

import { useSolarWind, useMagData } from "@/hooks/useSpaceWeather";
import type { SolarWindEntry, MagEntry } from "@/hooks/useSpaceWeather";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { cn } from "@/lib/utils";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Wind, TrendingUp, Info, HelpCircle, Gauge, Zap } from "lucide-react";
import type { SiteLocale } from "@/lib/locale";

type LegacyLocale = SiteLocale;

const copy = {
  uk: {
    pageTitle: "Сонячний вітер онлайн в режимі реального часу — швидкість та густина",
    pageDescription:
      "Сонячний вітер зараз у реальному часі. Швидкість, густина та графік за останні 2 години. Дані NOAA DSCOVR оновлюються щохвилини.",
    heroTitle: "Сонячний вітер сьогодні",
    heroText:
      "Швидкість та густина сонячного вітру в реальному часі. Графік за останні 2 години та міжпланетне магнітне поле (IMF Bz). Дані супутника DSCOVR від NOAA SWPC.",
    currentAria: "Поточні значення сонячного вітру",
    speed: "Швидкість",
    density: "Густина",
    normal: "Нормальна",
    elevated: "Підвищена",
    stronglySouth: "Сильно південний",
    south: "Південний",
    weaklySouth: "Слабо південний",
    north: "Північний",
    speedChartAria: "Графік швидкості та густини сонячного вітру",
    speedChartTitle: "Швидкість та густина — останні 2 години",
    bzChartAria: "Графік IMF Bz",
    bzChartTitle: "Міжпланетне магнітне поле (Bz) — останні 2 години",
    loading: "Завантаження...",
    bzNote:
      "Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу Землі. Bz нижче -5 нТ значно підвищує ймовірність геомагнітної бурі.",
    scaleAria: "Шкала швидкості сонячного вітру",
    scaleTitle: "Шкала швидкості сонячного вітру (км/с)",
    seoAria: "Про сонячний вітер",
    seoHeading: "Що таке сонячний вітер і чому він важливий?",
    seoText1:
      "Сонячний вітер — це безперервний потік заряджених частинок (плазми), що витікає з верхньої атмосфери Сонця — корони. Його швидкість варіюється від 300 до понад 800 км/с, а густина — від одиниць до десятків частинок на кубічний сантиметр. Сонячний вітер несе із собою міжпланетне магнітне поле (IMF), яке взаємодіє з магнітосферою Землі.",
    seoText2:
      "Коли швидкість сонячного вітру різко зростає, це може спричинити геомагнітну бурю. Особливо важливу роль відіграє компонента Bz міжпланетного магнітного поля: коли Bz стає від'ємним (південним), магнітосфера стає вразливішою. На цій сторінці ви знайдете поточні значення швидкості, густини сонячного вітру та IMF Bz у реальному часі від супутника DSCOVR (NOAA).",
    faqAria: "Часті питання про сонячний вітер",
    faqTitle: "Часті питання",
    tooltipKyiv: "Київ",
    areaSpeed: "Швидкість",
    areaDensity: "Густина",
    speedLevels: [
      { range: "< 300", status: "Повільний", color: "bg-storm-quiet", description: "Повільний сонячний вітер. Спокійні геомагнітні умови, мінімальний вплив на магнітосферу." },
      { range: "300–400", status: "Нормальний", color: "bg-storm-quiet", description: "Типова швидкість сонячного вітру. Стабільні умови, без впливу на технології та здоров'я." },
      { range: "400–500", status: "Підвищений", color: "bg-storm-minor", description: "Підвищена швидкість. Можливі незначні збурення магнітного поля, метеочутливі люди можуть відчувати легкий дискомфорт." },
      { range: "500–600", status: "Високий", color: "bg-storm-moderate", description: "Високошвидкісний потік. Ймовірність геомагнітних збурень, можливі збої GPS та головний біль." },
      { range: "600–800", status: "Дуже високий", color: "bg-storm-strong", description: "Дуже високошвидкісний потік. Високий ризик геомагнітної бурі, перебої радіозв'язку та навігації." },
      { range: "> 800", status: "Екстремальний", color: "bg-storm-severe", description: "Екстремальна швидкість сонячного вітру. Можливі сильні геомагнітні бурі, аварії енергомереж." },
    ],
    faqItems: [
      { q: "Що таке сонячний вітер?", a: "Сонячний вітер — це потік заряджених частинок (переважно протонів та електронів), що постійно виходить із зовнішньої атмосфери Сонця (корони). Його швидкість зазвичай становить 300–800 км/с." },
      { q: "Як швидкість сонячного вітру впливає на Землю?", a: "Різке зростання швидкості сонячного вітру може спровокувати геомагнітну бурю. Чим вища швидкість — тим більший тиск на магнітосферу Землі, що призводить до збурень магнітного поля." },
      { q: "Що таке густина сонячного вітру?", a: "Густина показує кількість частинок на кубічний сантиметр. Висока густина у поєднанні з високою швидкістю посилює вплив сонячного вітру на магнітосферу." },
      { q: "Як часто оновлюються дані?", a: "Дані сонячного вітру на нашому сайті оновлюються щохвилини на основі вимірювань супутника DSCOVR, розташованого в точці Лагранжа L1 між Сонцем та Землею." },
      { q: "Що таке Bz компонента?", a: "Bz — це вертикальна компонента міжпланетного магнітного поля (IMF). Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу, що збільшує ймовірність геомагнітної бурі." },
    ],
  },
  ru: {
    pageTitle: "Солнечный ветер онлайн в реальном времени — скорость и плотность",
    pageDescription:
      "Солнечный ветер сейчас в реальном времени. Скорость, плотность и график за последние 2 часа. Данные NOAA DSCOVR обновляются каждую минуту.",
    heroTitle: "Солнечный ветер сегодня",
    heroText:
      "Скорость и плотность солнечного ветра в реальном времени. График за последние 2 часа и межпланетное магнитное поле (IMF Bz). Данные спутника DSCOVR от NOAA SWPC.",
    currentAria: "Текущие значения солнечного ветра",
    speed: "Скорость",
    density: "Плотность",
    normal: "Нормальная",
    elevated: "Повышенная",
    stronglySouth: "Сильно южный",
    south: "Южный",
    weaklySouth: "Слабо южный",
    north: "Северный",
    speedChartAria: "График скорости и плотности солнечного ветра",
    speedChartTitle: "Скорость и плотность — последние 2 часа",
    bzChartAria: "График IMF Bz",
    bzChartTitle: "Межпланетное магнитное поле (Bz) — последние 2 часа",
    loading: "Загрузка...",
    bzNote:
      "Отрицательное значение Bz (южное) облегчает проникновение солнечного ветра в магнитосферу Земли. Bz ниже -5 нТ значительно повышает вероятность геомагнитной бури.",
    scaleAria: "Шкала скорости солнечного ветра",
    scaleTitle: "Шкала скорости солнечного ветра (км/с)",
    seoAria: "О солнечном ветре",
    seoHeading: "Что такое солнечный ветер и почему он важен?",
    seoText1:
      "Солнечный ветер — это непрерывный поток заряженных частиц (плазмы), исходящий из верхней атмосферы Солнца — короны. Его скорость варьируется от 300 до более 800 км/с, а плотность — от единиц до десятков частиц на кубический сантиметр. Солнечный ветер несет с собой межпланетное магнитное поле (IMF), которое взаимодействует с магнитосферой Земли.",
    seoText2:
      "Когда скорость солнечного ветра резко возрастает, это может вызвать геомагнитную бурю. Особенно важную роль играет компонента Bz межпланетного магнитного поля: когда Bz становится отрицательным (южным), магнитосфера становится более уязвимой. На этой странице вы найдете текущие значения скорости, плотности солнечного ветра и IMF Bz в реальном времени от спутника DSCOVR (NOAA).",
    faqAria: "Частые вопросы о солнечном ветре",
    faqTitle: "Частые вопросы",
    tooltipKyiv: "Киев",
    areaSpeed: "Скорость",
    areaDensity: "Плотность",
    speedLevels: [
      { range: "< 300", status: "Медленный", color: "bg-storm-quiet", description: "Медленный солнечный ветер. Спокойные геомагнитные условия, минимальное влияние на магнитосферу." },
      { range: "300–400", status: "Нормальный", color: "bg-storm-quiet", description: "Типичная скорость солнечного ветра. Стабильные условия, без влияния на технологии и самочувствие." },
      { range: "400–500", status: "Повышенный", color: "bg-storm-minor", description: "Повышенная скорость. Возможны небольшие возмущения магнитного поля, метеочувствительные люди могут ощущать легкий дискомфорт." },
      { range: "500–600", status: "Высокий", color: "bg-storm-moderate", description: "Высокоскоростной поток. Вероятны геомагнитные возмущения, возможны сбои GPS и головная боль." },
      { range: "600–800", status: "Очень высокий", color: "bg-storm-strong", description: "Очень высокоскоростной поток. Высокий риск геомагнитной бури, перебои радиосвязи и навигации." },
      { range: "> 800", status: "Экстремальный", color: "bg-storm-severe", description: "Экстремальная скорость солнечного ветра. Возможны сильные геомагнитные бури, аварии энергосетей." },
    ],
    faqItems: [
      { q: "Что такое солнечный ветер?", a: "Солнечный ветер — это поток заряженных частиц (преимущественно протонов и электронов), который постоянно выходит из внешней атмосферы Солнца (короны). Его скорость обычно составляет 300–800 км/с." },
      { q: "Как скорость солнечного ветра влияет на Землю?", a: "Резкий рост скорости солнечного ветра может спровоцировать геомагнитную бурю. Чем выше скорость, тем больше давление на магнитосферу Земли, что приводит к возмущениям магнитного поля." },
      { q: "Что такое плотность солнечного ветра?", a: "Плотность показывает количество частиц на кубический сантиметр. Высокая плотность в сочетании с высокой скоростью усиливает влияние солнечного ветра на магнитосферу." },
      { q: "Как часто обновляются данные?", a: "Данные солнечного ветра на нашем сайте обновляются каждую минуту на основе измерений спутника DSCOVR, расположенного в точке Лагранжа L1 между Солнцем и Землей." },
      { q: "Что такое компонента Bz?", a: "Bz — это вертикальная компонента межпланетного магнитного поля (IMF). Отрицательное значение Bz (южное) облегчает проникновение солнечного ветра в магнитосферу, что увеличивает вероятность геомагнитной бури." },
    ],
  },
  pl: {
    pageTitle: "Wiatr słoneczny online w czasie rzeczywistym — prędkość i gęstość",
    pageDescription:
      "Aktualny wiatr słoneczny w czasie rzeczywistym. Prędkość, gęstość i wykres z ostatnich 2 godzin na podstawie danych NOAA DSCOVR.",
    heroTitle: "Wiatr słoneczny dzisiaj",
    heroText:
      "Prędkość i gęstość wiatru słonecznego w czasie rzeczywistym. Wykres z ostatnich 2 godzin oraz międzyplanetarne pole magnetyczne IMF Bz.",
    currentAria: "Aktualne wartości wiatru słonecznego",
    speed: "Prędkość",
    density: "Gęstość",
    normal: "Normalna",
    elevated: "Podwyższona",
    stronglySouth: "Silnie południowe",
    south: "Południowe",
    weaklySouth: "Lekko południowe",
    north: "Północne",
    speedChartAria: "Wykres prędkości i gęstości wiatru słonecznego",
    speedChartTitle: "Prędkość i gęstość — ostatnie 2 godziny",
    bzChartAria: "Wykres IMF Bz",
    bzChartTitle: "Międzyplanetarne pole magnetyczne (Bz) — ostatnie 2 godziny",
    loading: "Ładowanie...",
    bzNote:
      "Ujemna wartość Bz ułatwia przenikanie wiatru słonecznego do magnetosfery Ziemi. Gdy Bz spada poniżej -5 nT, ryzyko burzy geomagnetycznej wyraźnie rośnie.",
    scaleAria: "Skala prędkości wiatru słonecznego",
    scaleTitle: "Skala prędkości wiatru słonecznego (km/s)",
    seoAria: "O wietrze słonecznym",
    seoHeading: "Czym jest wiatr słoneczny i dlaczego ma znaczenie?",
    seoText1:
      "Wiatr słoneczny to stały strumień naładowanych cząstek wypływających z korony słonecznej. Jego prędkość zwykle mieści się w zakresie od 300 do ponad 800 km/s, a gęstość może szybko się zmieniać.",
    seoText2:
      "Gdy prędkość i gęstość wiatru słonecznego rosną, zwiększa się nacisk na magnetosferę Ziemi. Szczególne znaczenie ma składowa Bz, ponieważ ujemne wartości zwiększają prawdopodobieństwo zaburzeń geomagnetycznych.",
    faqAria: "Najczęstsze pytania o wiatr słoneczny",
    faqTitle: "Najczęstsze pytania",
    tooltipKyiv: "czas lokalny",
    areaSpeed: "Prędkość",
    areaDensity: "Gęstość",
    speedLevels: [
      { range: "< 300", status: "Powolny", color: "bg-storm-quiet", description: "Powolny wiatr słoneczny, zwykle bez istotnego wpływu na magnetosferę." },
      { range: "300–400", status: "Normalny", color: "bg-storm-quiet", description: "Typowa prędkość wiatru słonecznego i spokojne warunki geomagnetyczne." },
      { range: "400–500", status: "Podwyższony", color: "bg-storm-minor", description: "Podwyższona prędkość może sprzyjać lekkim zaburzeniom geomagnetycznym." },
      { range: "500–600", status: "Wysoki", color: "bg-storm-moderate", description: "Szybszy strumień zwiększa ryzyko bardziej odczuwalnych zaburzeń." },
      { range: "600–800", status: "Bardzo wysoki", color: "bg-storm-strong", description: "Bardzo szybki wiatr słoneczny może prowadzić do silniejszych burz magnetycznych." },
      { range: "> 800", status: "Ekstremalny", color: "bg-storm-severe", description: "Ekstremalnie szybki strumień o dużym potencjale zaburzeń geomagnetycznych." },
    ],
    faqItems: [
      { q: "Czym jest wiatr słoneczny?", a: "To strumień naładowanych cząstek emitowanych przez Słońce. Gdy dociera do Ziemi z większą prędkością i gęstością, może nasilać aktywność geomagnetyczną." },
      { q: "Jak prędkość wiatru słonecznego wpływa na Ziemię?", a: "Wyższa prędkość oznacza silniejsze oddziaływanie na magnetosferę. W połączeniu z niekorzystnym polem magnetycznym może prowadzić do burz geomagnetycznych." },
      { q: "Czym jest gęstość wiatru słonecznego?", a: "Gęstość pokazuje, ile cząstek znajduje się w jednostce objętości. Wysoka gęstość wraz z dużą prędkością zwykle zwiększa wpływ na magnetosferę." },
      { q: "Jak często aktualizowane są dane?", a: "Dane pochodzą z pomiarów satelity DSCOVR i są regularnie odświeżane, dzięki czemu można śledzić zmiany niemal w czasie rzeczywistym." },
      { q: "Co oznacza składowa Bz?", a: "Bz to część międzyplanetarnego pola magnetycznego. Ujemny Bz zwiększa szansę, że wiatr słoneczny skuteczniej zaburzy pole magnetyczne Ziemi." },
    ],
  },
} as const;

const localizedCopy = {
  ...copy,
  ro: {
    ...copy.pl,
    pageTitle: "Vânt solar online în timp real — viteză și densitate",
    pageDescription:
      "Vântul solar acum în timp real: viteză, densitate și grafic pentru ultimele 2 ore pe baza datelor NOAA DSCOVR.",
    heroTitle: "Vântul solar astăzi",
    heroText:
      "Viteza și densitatea vântului solar în timp real. Grafic pentru ultimele 2 ore și componenta câmpului magnetic interplanetar IMF Bz.",
    currentAria: "Valorile curente ale vântului solar",
    speed: "Viteză",
    density: "Densitate",
    normal: "Normală",
    elevated: "Ridicată",
    stronglySouth: "Puternic sudic",
    south: "Sudic",
    weaklySouth: "Ușor sudic",
    north: "Nordic",
    speedChartAria: "Graficul vitezei și densității vântului solar",
    speedChartTitle: "Viteză și densitate — ultimele 2 ore",
    bzChartAria: "Grafic IMF Bz",
    bzChartTitle: "Câmp magnetic interplanetar (Bz) — ultimele 2 ore",
    loading: "Se încarcă...",
    bzNote:
      "Valorile negative ale Bz facilitează pătrunderea vântului solar în magnetosferă. Când Bz scade sub -5 nT, riscul de furtună geomagnetică crește.",
    scaleAria: "Scara vitezei vântului solar",
    scaleTitle: "Scara vitezei vântului solar (km/s)",
    seoAria: "Despre vântul solar",
    seoHeading: "Ce este vântul solar și de ce contează?",
    seoText1:
      "Vântul solar este un flux continuu de particule încărcate care vine din coroana Soarelui. Viteza sa variază de obicei între 300 și peste 800 km/s.",
    seoText2:
      "Când viteza și densitatea cresc, presiunea asupra magnetosferei devine mai mare. Componenta Bz este importantă deoarece valorile negative cresc probabilitatea perturbărilor geomagnetice.",
    faqAria: "Întrebări frecvente despre vântul solar",
    faqTitle: "Întrebări frecvente",
    tooltipKyiv: "ora locală",
    areaSpeed: "Viteză",
    areaDensity: "Densitate",
    speedLevels: [
      { range: "< 300", status: "Lent", color: "bg-storm-quiet", description: "Vânt solar lent, de obicei fără impact important." },
      { range: "300-400", status: "Normal", color: "bg-storm-quiet", description: "Viteză tipică și condiții geomagnetice calme." },
      { range: "400-500", status: "Ridicat", color: "bg-storm-minor", description: "Poate favoriza ușoare perturbări geomagnetice." },
      { range: "500-600", status: "Înalt", color: "bg-storm-moderate", description: "Crește riscul unor perturbări mai vizibile." },
      { range: "600-800", status: "Foarte înalt", color: "bg-storm-strong", description: "Poate contribui la furtuni magnetice mai puternice." },
      { range: "> 800", status: "Extrem", color: "bg-storm-severe", description: "Flux foarte rapid cu potențial ridicat de perturbări." },
    ],
    faqItems: [
      { q: "Ce este vântul solar?", a: "Este fluxul de particule încărcate emis de Soare și transportat prin spațiu." },
      { q: "De ce contează viteza?", a: "Viteza mai mare înseamnă presiune mai mare asupra magnetosferei Pământului." },
      { q: "Ce este densitatea?", a: "Densitatea arată câte particule se află într-un volum dat al vântului solar." },
      { q: "Ce înseamnă Bz?", a: "Bz este componenta verticală a câmpului magnetic interplanetar. Valorile negative cresc riscul de activitate geomagnetică." },
      { q: "Cât de des se actualizează datele?", a: "Datele sunt preluate din măsurători NOAA și se actualizează regulat." },
    ],
  },
  hu: {
    ...copy.pl,
    pageTitle: "Napszél online valós időben — sebesség és sűrűség",
    pageDescription:
      "Aktuális napszél valós időben: sebesség, sűrűség és az elmúlt 2 óra grafikonja NOAA DSCOVR adatok alapján.",
    heroTitle: "Napszél ma",
    heroText:
      "A napszél sebessége és sűrűsége valós időben. Grafikon az elmúlt 2 óráról és az interplanetáris mágneses tér IMF Bz komponense.",
    currentAria: "A napszél aktuális értékei",
    speed: "Sebesség",
    density: "Sűrűség",
    normal: "Normális",
    elevated: "Emelkedett",
    stronglySouth: "Erősen déli",
    south: "Déli",
    weaklySouth: "Enyhén déli",
    north: "Északi",
    speedChartAria: "A napszél sebességének és sűrűségének grafikonja",
    speedChartTitle: "Sebesség és sűrűség — elmúlt 2 óra",
    bzChartAria: "IMF Bz grafikon",
    bzChartTitle: "Interplanetáris mágneses tér (Bz) — elmúlt 2 óra",
    loading: "Betöltés...",
    bzNote:
      "A negatív Bz érték megkönnyíti a napszél bejutását a Föld magnetoszférájába. -5 nT alatt nő a geomágneses vihar esélye.",
    scaleAria: "Napszélsebesség skála",
    scaleTitle: "Napszélsebesség skála (km/s)",
    seoAria: "A napszélről",
    seoHeading: "Mi az a napszél és miért fontos?",
    seoText1:
      "A napszél a Nap koronájából kiáramló töltött részecskék folyamatos árama. Sebessége általában 300 és 800 km/s között mozog, de aktív időszakokban gyorsan változhat.",
    seoText2:
      "Ha a napszél sebessége és sűrűsége nő, erősebb nyomás éri a Föld magnetoszféráját. Különösen fontos a Bz komponens: negatív értékeknél nagyobb a geomágneses zavar esélye.",
    faqAria: "Gyakori kérdések a napszélről",
    faqTitle: "Gyakori kérdések",
    tooltipKyiv: "helyi idő",
    areaSpeed: "Sebesség",
    areaDensity: "Sűrűség",
    speedLevels: [
      { range: "< 300", status: "Lassú", color: "bg-storm-quiet", description: "Lassú napszél, általában jelentős hatás nélkül." },
      { range: "300-400", status: "Normális", color: "bg-storm-quiet", description: "Tipikus napszélsebesség és nyugodt geomágneses feltételek." },
      { range: "400-500", status: "Emelkedett", color: "bg-storm-minor", description: "Enyhe geomágneses zavarokat segíthet elő." },
      { range: "500-600", status: "Magas", color: "bg-storm-moderate", description: "Nő az észrevehetőbb zavarok esélye." },
      { range: "600-800", status: "Nagyon magas", color: "bg-storm-strong", description: "Erősebb mágneses viharokhoz járulhat hozzá." },
      { range: "> 800", status: "Extrém", color: "bg-storm-severe", description: "Nagyon gyors áramlás, magas geomágneses zavarási potenciállal." },
    ],
    faqItems: [
      { q: "Mi a napszél?", a: "A napszél a Napból érkező töltött részecskék árama, amely a bolygóközi térben halad." },
      { q: "Miért számít a sebesség?", a: "A nagyobb sebesség erősebb nyomást jelent a Föld magnetoszférájára." },
      { q: "Mit jelent a sűrűség?", a: "A sűrűség azt mutatja, hány részecske található a napszél adott térfogatában." },
      { q: "Mit jelent a Bz?", a: "A Bz az interplanetáris mágneses tér függőleges komponense. A negatív értékek növelik az aktivitás esélyét." },
      { q: "Milyen gyakran frissülnek az adatok?", a: "Az adatok NOAA mérésekből származnak és rendszeresen frissülnek." },
    ],
  },
  bg: {
    ...copy.pl,
    pageTitle: "Слънчев вятър онлайн в реално време — скорост и плътност",
    pageDescription:
      "Актуален слънчев вятър в реално време: скорост, плътност и графика за последните 2 часа по данни на NOAA DSCOVR.",
    heroTitle: "Слънчев вятър днес",
    heroText:
      "Скоростта и плътността на слънчевия вятър в реално време. Графика за последните 2 часа и компонентата на междупланетното магнитно поле IMF Bz.",
    currentAria: "Текущи стойности на слънчевия вятър",
    speed: "Скорост",
    density: "Плътност",
    normal: "Нормална",
    elevated: "Повишена",
    stronglySouth: "Силно южен",
    south: "Южен",
    weaklySouth: "Слабо южен",
    north: "Северен",
    speedChartAria: "Графика на скоростта и плътността на слънчевия вятър",
    speedChartTitle: "Скорост и плътност — последните 2 часа",
    bzChartAria: "Графика на IMF Bz",
    bzChartTitle: "Междупланетно магнитно поле (Bz) — последните 2 часа",
    loading: "Зареждане...",
    bzNote:
      "Отрицателната стойност на Bz (южна) улеснява проникването на слънчевия вятър в магнитосферата на Земята. Под -5 nT рискът от геомагнитна буря значително нараства.",
    scaleAria: "Скала на скоростта на слънчевия вятър",
    scaleTitle: "Скала на скоростта на слънчевия вятър (км/с)",
    seoAria: "За слънчевия вятър",
    seoHeading: "Какво е слънчевият вятър и защо е важен?",
    seoText1:
      "Слънчевият вятър е непрекъснат поток от заредени частици, изтичащ от короната на Слънцето. Скоростта му обикновено е между 300 и над 800 км/с, а плътността може бързо да се променя.",
    seoText2:
      "Когато скоростта и плътността на слънчевия вятър нарастват, натискът върху магнитосферата на Земята се увеличава. Особено значение има компонентата Bz: отрицателните стойности повишават вероятността за геомагнитни смущения.",
    faqAria: "Често задавани въпроси за слънчевия вятър",
    faqTitle: "Често задавани въпроси",
    tooltipKyiv: "местно време",
    areaSpeed: "Скорост",
    areaDensity: "Плътност",
    speedLevels: [
      { range: "< 300", status: "Бавен", color: "bg-storm-quiet", description: "Бавен слънчев вятър, обикновено без значително въздействие." },
      { range: "300-400", status: "Нормален", color: "bg-storm-quiet", description: "Типична скорост на слънчевия вятър и спокойни геомагнитни условия." },
      { range: "400-500", status: "Повишен", color: "bg-storm-minor", description: "Може да способства за леки геомагнитни смущения." },
      { range: "500-600", status: "Висок", color: "bg-storm-moderate", description: "Нараства вероятността за по-осезаеми смущения." },
      { range: "600-800", status: "Много висок", color: "bg-storm-strong", description: "Може да допринесе за по-силни магнитни бури." },
      { range: "> 800", status: "Екстремален", color: "bg-storm-severe", description: "Много бърз поток с висок потенциал за геомагнитни смущения." },
    ],
    faqItems: [
      { q: "Какво е слънчевият вятър?", a: "Слънчевият вятър е поток от заредени частици, идващ от Слънцето и движещ се в междупланетното пространство." },
      { q: "Защо е важна скоростта?", a: "По-високата скорост означава по-силен натиск върху магнитосферата на Земята." },
      { q: "Какво е плътността?", a: "Плътността показва колко частици се съдържат в даден обем от слънчевия вятър." },
      { q: "Какво означава Bz?", a: "Bz е вертикалната компонента на междупланетното магнитно поле. Отрицателните стойности повишават вероятността за геомагнитна активност." },
      { q: "Колко често се обновяват данните?", a: "Данните идват от измерванията на NOAA и се обновяват редовно." },
    ],
  },
  cs: {
    ...copy.pl,
    pageTitle: "Sluneční vítr online v reálném čase — rychlost a hustota",
    pageDescription:
      "Aktuální sluneční vítr v reálném čase: rychlost, hustota a graf za poslední 2 hodiny podle dat NOAA DSCOVR.",
    heroTitle: "Sluneční vítr dnes",
    heroText:
      "Rychlost a hustota slunečního větru v reálném čase. Graf za poslední 2 hodiny a meziplanetární magnetické pole IMF Bz.",
    currentAria: "Aktuální hodnoty slunečního větru",
    speed: "Rychlost",
    density: "Hustota",
    normal: "Normální",
    elevated: "Zvýšená",
    stronglySouth: "Silně jižní",
    south: "Jižní",
    weaklySouth: "Slabě jižní",
    north: "Severní",
    speedChartAria: "Graf rychlosti a hustoty slunečního větru",
    speedChartTitle: "Rychlost a hustota — poslední 2 hodiny",
    bzChartAria: "Graf IMF Bz",
    bzChartTitle: "Meziplanetární magnetické pole (Bz) — poslední 2 hodiny",
    loading: "Načítání...",
    bzNote:
      "Záporná hodnota Bz (jižní) usnadňuje pronikání slunečního větru do magnetosféry Země. Když Bz klesne pod -5 nT, riziko geomagnetické bouře výrazně roste.",
    scaleAria: "Škála rychlosti slunečního větru",
    scaleTitle: "Škála rychlosti slunečního větru (km/s)",
    seoAria: "O slunečním větru",
    seoHeading: "Co je sluneční vítr a proč je důležitý?",
    seoText1:
      "Sluneční vítr je nepřetržitý proud nabitých částic vytékající z koróny Slunce. Jeho rychlost se obvykle pohybuje od 300 do více než 800 km/s a hustota se může rychle měnit.",
    seoText2:
      "Když rychlost a hustota slunečního větru rostou, zvyšuje se tlak na magnetosféru Země. Zvláštní význam má složka Bz: záporné hodnoty zvyšují pravděpodobnost geomagnetických poruch.",
    faqAria: "Časté otázky o slunečním větru",
    faqTitle: "Časté otázky",
    tooltipKyiv: "místní čas",
    areaSpeed: "Rychlost",
    areaDensity: "Hustota",
    speedLevels: [
      { range: "< 300", status: "Pomalý", color: "bg-storm-quiet", description: "Pomalý sluneční vítr, obvykle bez významného vlivu na magnetosféru." },
      { range: "300–400", status: "Normální", color: "bg-storm-quiet", description: "Typická rychlost slunečního větru a klidné geomagnetické podmínky." },
      { range: "400–500", status: "Zvýšený", color: "bg-storm-minor", description: "Zvýšená rychlost může přispívat k mírným geomagnetickým poruchám." },
      { range: "500–600", status: "Vysoký", color: "bg-storm-moderate", description: "Rychlejší proud zvyšuje riziko výraznějších poruch." },
      { range: "600–800", status: "Velmi vysoký", color: "bg-storm-strong", description: "Velmi rychlý sluneční vítr může vést k silnějším magnetickým bouřím." },
      { range: "> 800", status: "Extrémní", color: "bg-storm-severe", description: "Extrémně rychlý proud s velkým potenciálem geomagnetických poruch." },
    ],
    faqItems: [
      { q: "Co je sluneční vítr?", a: "Je to proud nabitých částic vyzařovaných Sluncem. Když dorazí k Zemi s vyšší rychlostí a hustotou, může zesilovat geomagnetickou aktivitu." },
      { q: "Jak rychlost slunečního větru ovlivňuje Zemi?", a: "Vyšší rychlost znamená silnější působení na magnetosféru. Ve spojení s nepříznivým magnetickým polem může vést ke geomagnetickým bouřím." },
      { q: "Co je hustota slunečního větru?", a: "Hustota ukazuje, kolik částic se nachází v jednotce objemu. Vysoká hustota spolu s vysokou rychlostí obvykle zvyšuje vliv na magnetosféru." },
      { q: "Jak často se data aktualizují?", a: "Data pocházejí z měření satelitu DSCOVR a jsou pravidelně obnovována, takže lze změny sledovat téměř v reálném čase." },
      { q: "Co znamená složka Bz?", a: "Bz je část meziplanetárního magnetického pole. Záporný Bz zvyšuje šanci, že sluneční vítr účinněji naruší magnetické pole Země." },
    ],
  },
  en: {
    ...copy.uk,
    pageTitle: "Solar wind online in real time — speed and density",
    pageDescription:
      "Current solar wind data in real time: speed, density and IMF Bz charts based on NOAA DSCOVR measurements.",
    heroTitle: "Solar wind today",
    heroText:
      "Solar wind speed and density in real time, with IMF Bz data and recent charts from NOAA SWPC.",
    currentAria: "Current solar wind values",
    speed: "Speed",
    density: "Density",
    normal: "Normal",
    elevated: "Elevated",
    stronglySouth: "Strongly southward",
    south: "Southward",
    weaklySouth: "Weakly southward",
    north: "Northward",
    speedChartAria: "Solar wind speed and density chart",
    speedChartTitle: "Speed and density — last 2 hours",
    bzChartAria: "IMF Bz chart",
    bzChartTitle: "Interplanetary magnetic field (Bz) — last 2 hours",
    loading: "Loading...",
    bzNote:
      "Negative Bz makes it easier for solar wind energy to enter Earth's magnetosphere. Values below -5 nT increase geomagnetic storm potential.",
    scaleAria: "Solar wind speed scale",
    scaleTitle: "Solar wind speed scale (km/s)",
    seoAria: "About solar wind",
    seoHeading: "What is solar wind and why is it important?",
    seoText1:
      "Solar wind is a continuous stream of charged particles flowing from the Sun. Its speed, density and magnetic field determine how strongly it can interact with Earth's magnetosphere.",
    seoText2:
      "A rapid increase in solar wind speed or a sustained southward Bz can raise the risk of geomagnetic storms. This page shows recent data in a practical format.",
    faqAria: "Solar wind FAQ",
    faqTitle: "FAQ",
    tooltipKyiv: "local time",
    areaSpeed: "Speed",
    areaDensity: "Density",
    speedLevels: [
      { range: "< 300", status: "Slow", color: "bg-storm-quiet", description: "Slow solar wind with generally calm conditions." },
      { range: "300-400", status: "Normal", color: "bg-storm-quiet", description: "Typical solar wind speed." },
      { range: "400-500", status: "Elevated", color: "bg-storm-minor", description: "May contribute to mild geomagnetic activity." },
      { range: "500-600", status: "High", color: "bg-storm-moderate", description: "Higher chance of noticeable disturbances." },
      { range: "600-800", status: "Very high", color: "bg-storm-strong", description: "Can contribute to stronger magnetic storms." },
      { range: "> 800", status: "Extreme", color: "bg-storm-severe", description: "Very fast flow with high disturbance potential." },
    ],
    faqItems: [
      { q: "What is solar wind?", a: "Solar wind is a flow of charged particles coming from the Sun." },
      { q: "Why does speed matter?", a: "Higher speed means stronger pressure on Earth's magnetosphere." },
      { q: "What is density?", a: "Density shows how many particles are present in a given volume of solar wind." },
      { q: "What does Bz mean?", a: "Bz is the vertical component of the interplanetary magnetic field. Negative values increase storm potential." },
      { q: "How often is data updated?", a: "Data comes from NOAA measurements and is refreshed regularly." },
    ],
  },
};

const getPageTimeZone = (locale: LegacyLocale) =>
  locale === "pl" ? "Europe/Warsaw" : locale === "ro" ? "Europe/Chisinau" : locale === "hu" ? "Europe/Budapest" : locale === "bg" ? "Europe/Sofia" : locale === "cs" ? "Europe/Prague" : locale === "en" ? "UTC" : "Europe/Kyiv";

const todayStr = (localeTag: string, timeZone: string) =>
  new Date().toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  });

const toLocalTime = (utc: string, localeTag: string, timeZone: string) => {
  const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
  return d.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", timeZone });
};

const getSpeedColor = (speed: number) => {
  if (speed >= 800) return "text-storm-severe";
  if (speed >= 600) return "text-storm-strong";
  if (speed >= 500) return "text-storm-moderate";
  if (speed >= 400) return "text-storm-minor";
  return "text-storm-quiet";
};

const getSpeedStatus = (speed: number, locale: SiteLocale) => {
  const levels = localizedCopy[locale];
  if (speed >= 800) return levels.speedLevels[5].status;
  if (speed >= 600) return levels.speedLevels[4].status;
  if (speed >= 500) return levels.speedLevels[3].status;
  if (speed >= 400) return levels.speedLevels[2].status;
  if (speed >= 300) return levels.speedLevels[1].status;
  return levels.speedLevels[0].status;
};

const CustomTooltip = ({ active, payload, label, locale = "uk" }: any) => {
  if (!active || !payload) return null;
  const t = localizedCopy[locale as SiteLocale];
  const speedUnit = locale === "uk" || locale === "ru" || locale === "bg" ? "км/с" : "km/s";
  const densityUnit = locale === "uk" ? "p/см³" : locale === "ru" ? "p/см³" : locale === "bg" ? "p/см³" : "p/cm³";
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 font-mono text-xs text-muted-foreground">{label} {t.tooltipKyiv}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {entry.name === t.areaSpeed ? speedUnit : entry.name === t.areaDensity ? densityUnit : "nT"}
        </p>
      ))}
    </div>
  );
};

interface SolarWindProps {
  locale?: LegacyLocale;
  initialWind?: SolarWindEntry[] | null;
  initialMag?: MagEntry[] | null;
}

const SolarWind = ({ locale = "uk", initialWind, initialMag }: SolarWindProps) => {
  const t = localizedCopy[locale];
  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-MD" : locale === "hu" ? "hu-HU" : locale === "bg" ? "bg-BG" : locale === "cs" ? "cs-CZ" : locale === "en" ? "en-US" : "uk-UA";
  const timeZone = getPageTimeZone(locale);
  const speedUnit = locale === "uk" || locale === "ru" || locale === "bg" ? "км/с" : "km/s";
  const densityUnit = locale === "uk" || locale === "ru" || locale === "bg" ? "p/см³" : "p/cm³";
  const today = todayStr(localeTag, timeZone);

  const { data: windData, isLoading: windLoading } = useSolarWind(initialWind ?? undefined);
  const { data: magData, isLoading: magLoading } = useMagData(initialMag ?? undefined);

  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;

  // NOAA/DSCOVR marks missing samples with sentinels (e.g. -9999) that would
  // wreck the Y-axis scale; drop out-of-range values to null instead of plotting.
  const saneSpeed = (v: number) => (Number.isFinite(v) && v > 0 && v < 3000 ? v : null);
  const saneDensity = (v: number) => (Number.isFinite(v) && v >= 0 && v < 500 ? v : null);
  const saneMag = (v: number) => (Number.isFinite(v) && v > -900 && v < 900 ? v : null);

  const speedChartData = (windData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toLocalTime(d.time_tag, localeTag, timeZone),
      speed: saneSpeed(d.speed),
      density: saneDensity(d.density),
    }));

  const magChartData = (magData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toLocalTime(d.time_tag, localeTag, timeZone),
      bz: saneMag(d.bz),
      bt: saneMag(d.bt),
    }));

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
    <div className="min-h-screen bg-background">
      <main className="official-page-main" role="main">
        <div className="official-page-shell space-y-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        {/* Hero */}
        <header className="official-page-header space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {t.heroTitle}, {today}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            {t.heroText}
          </p>
        </header>

        {/* Current values */}
        <section className="grid gap-6 md:grid-cols-3" aria-label={t.currentAria}>
          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.speed}
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("font-mono text-5xl font-bold text-glow-cyan", getSpeedColor(latestWind?.speed ?? 0))}>
                  {latestWind?.speed?.toFixed(0) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">{speedUnit}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getSpeedStatus(latestWind?.speed ?? 0, locale)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.density}
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold text-foreground text-glow-cyan">
                  {latestWind?.density?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">{densityUnit}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestWind?.density ?? 0) > 10 ? t.elevated : t.normal}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                IMF Bz
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "font-mono text-5xl font-bold text-glow-cyan",
                  (latestMag?.bz ?? 0) < -5 ? "text-storm-severe" :
                  (latestMag?.bz ?? 0) < 0 ? "text-storm-moderate" : "text-storm-quiet"
                )}>
                  {latestMag?.bz?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">{locale === "uk" || locale === "ru" || locale === "bg" ? "нТ" : "nT"}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestMag?.bz ?? 0) < -10 ? t.stronglySouth :
                 (latestMag?.bz ?? 0) < -5 ? t.south :
                 (latestMag?.bz ?? 0) < 0 ? t.weaklySouth : t.north}
              </p>
            </div>
          </div>
        </section>

        <div className="md:hidden">
          <MobileAdsenseSlot />
        </div>

        {/* Speed & Density Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.speedChartAria}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.speedChartTitle}
            </h2>
          </div>
          {windLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">{t.loading}</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speedChartData}>
                  <defs>
                    <linearGradient id="swSpeedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="swDensityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(speedChartData.length / 6)}
                  />
                  <YAxis yAxisId="speed" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={40} />
                  <YAxis yAxisId="density" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={30} />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <ReferenceLine yAxisId="speed" y={500} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: `500 ${speedUnit}`, fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Area yAxisId="speed" type="monotone" dataKey="speed" name={t.areaSpeed} stroke="hsl(180, 100%, 50%)" fill="url(#swSpeedGrad)" strokeWidth={2} connectNulls dot={false} />
                  <Area yAxisId="density" type="monotone" dataKey="density" name={t.areaDensity} stroke="hsl(35, 100%, 55%)" fill="url(#swDensityGrad)" strokeWidth={2} connectNulls dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Bz Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.bzChartAria}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.bzChartTitle}
            </h2>
          </div>
          {magLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">{t.loading}</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={magChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(magChartData.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <ReferenceLine y={-5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Bz -5", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Line type="monotone" dataKey="bz" name="Bz" stroke="hsl(280, 80%, 60%)" strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="bt" name="Bt" stroke="hsl(var(--muted-foreground))" strokeWidth={1} dot={false} strokeDasharray="3 3" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.bzNote}
          </p>
        </section>

        {/* Speed Levels Table */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.scaleAria}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t.scaleTitle}
          </h2>
          <div className="grid gap-2">
            {t.speedLevels.map((level) => (
              <div key={level.range} className="flex items-start gap-3 rounded-md border border-border/20 bg-muted/20 p-3">
                <span className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", level.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{level.range} {speedUnit}</span>
                    <span className="text-xs text-muted-foreground">— {level.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label={t.seoAria}>
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.seoHeading}
          </h2>
          <p>{t.seoText1}</p>
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
              <details key={i} className="group rounded-md border border-border/20 bg-muted/10">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground/80 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default SolarWind;
