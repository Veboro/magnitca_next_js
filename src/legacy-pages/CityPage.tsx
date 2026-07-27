"use client";

import Link from "next/link";
import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import type { CityWeatherResult } from "@/hooks/useCityWeather";
import { useCitySunTimes } from "@/hooks/useCitySunTimes";
import type { CitySunTimesPayload } from "@/lib/city-sun-times";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import type { KpEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import { useKpForecast, type KpForecastEntry } from "@/hooks/useKpForecast";
import { useKpForecast27Day } from "@/hooks/useKpForecast27Day";
import { formatApiLocalTime } from "@/lib/city-sun-times";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Activity, MapPin, Info, CalendarDays, AlertTriangle, HelpCircle } from "lucide-react";
import { ALL_UK_CITIES, getCityBySlug } from "@/data/cities";
import { getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import { getCityByMdSlug } from "@/data/cities-md";
import { getCityByHuSlug } from "@/data/cities-hu";
import { getCityByBgSlug } from "@/data/cities-bg";
import { getCityByPlSlug } from "@/data/cities-pl";
import { getCityByCsSlug } from "@/data/cities-cs";
import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { SiteLocale } from "@/lib/locale";
import { getUhmcRegionCode } from "@/lib/uhmc-warning";
import { getHungaroMetCountyForCity } from "@/lib/hungaromet-counties";
import { CityImpactPanel } from "@/components/city/city-impact-panel";
import { CityStormFeelingSummary } from "@/components/city/city-storm-feeling-summary";
import { getOblastPathsByKey, getOblastTitle } from "@/lib/oblast-routes";
import { getCityGenitive, ruPreposition, ukPreposition } from "@/lib/city-declension";
import { ruGeoContext, ukGeoContext } from "@/lib/city-geo";
import { getCitySeoContent, CITY_FAQ_HEADING } from "@/lib/city-content";
import { getRegionForCity } from "@/lib/country-region-routes";
import { absoluteUrl } from "@/lib/site";

type LegacyLocale = SiteLocale;

const copy = {
  uk: {
    calm: "Спокійно",
    low: "Низька активність",
    moderate: "Помірна буря",
    strong: "Сильна буря",
    extreme: "Екстремальна буря",
    geoSituation: "Геомагнітна ситуація в",
    sunriseSunset: "Схід / Захід сонця",
    sunrise: "Схід",
    sunset: "Захід",
    dayLength: "Тривалість дня",
    coordinates: "Координати",
    latitude: "Широта",
    longitude: "Довгота",
    timezone: "Часовий пояс",
    radiation: "Радіаційний фон",
    normal: "В межах норми",
    forecast3: "Прогноз Kp індексу для",
    forecast3suffix: "на 3 дні (по 3-годинних інтервалах)",
    loading: "Завантаження прогнозу...",
    unavailable: "Дані прогнозу недоступні.",
    max: "макс. Kp",
    forecast3Foot1: "Прогноз Kp індексу для міста",
    forecast3Foot2: "від NOAA Space Weather Prediction Center. Час — київський",
    forecast27: "Прогноз Kp на 27 днів —",
    forecast27Foot1: "27-денний прогноз Kp-індексу для міста",
    forecast27Foot2: "від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.",
    airQuality: "Якість повітря",
    currentMetrics: "Поточні показники",
    wind: "Вітер",
    humidity: "Вологість",
    pressure: "Тиск",
    cloudiness: "Хмарність",
    uv: "UV індекс",
    kpIndex: "Kp індекс",
    high: "Висока",
    medium: "Помірна",
    lowHumidity: "Низька",
    overcast: "Суцільна",
    variable: "Мінлива",
    clear: "Малохмарно",
    uvVeryHigh: "Дуже високий",
    uvHigh: "Високий",
    uvMedium: "Помірний",
    uvLow: "Низький",
    aboutPage: "Про сторінку",
    cityNotFound: "Місто не знайдено",
    srOnlyHeading: "Магнітні бурі в",
    srOnlySuffix: "погода та якість повітря",
    geoActivityStatus: "Статус геомагнітної активності в",
    forecast3Aria: "Прогноз Kp індексу на 3 дні",
    forecast27Aria: "Прогноз Kp на 27 днів",
    seoHeading: "Магнітні бурі в",
    today: "сьогодні",
    currentKp: "Поточний Kp-індекс",
    stormLevel: "рівень геомагнітної бурі",
    forecastRange: "Прогнозований діапазон Kp за добу",
    radioBlackout: "Шкала радіозатемнень",
    radiationStorm: "шкала радіаційних бур",
    temperature: "Температура повітря",
    windSpeed: "вітер",
    airIndex: "Індекс якості повітря AQI",
    dataSource: "Дані",
    popularInRegion: "Популярні міста",
    hydrometWarning: "Попередження від гідрометцентру",
    hydrometSource: "Джерело: УкрГМЦ",
    hydrometUnavailable: "Попередження тимчасово недоступні",
    home: "Головна",
    breadcrumbAria: "Навігація сторінкою",
  },
  ru: {
    calm: "Спокойно",
    low: "Низкая активность",
    moderate: "Умеренная буря",
    strong: "Сильная буря",
    extreme: "Экстремальная буря",
    geoSituation: "Геомагнитная ситуация в",
    sunriseSunset: "Восход / Закат солнца",
    sunrise: "Восход",
    sunset: "Закат",
    dayLength: "Длительность дня",
    coordinates: "Координаты",
    latitude: "Широта",
    longitude: "Долгота",
    timezone: "Часовой пояс",
    radiation: "Радиационный фон",
    normal: "В пределах нормы",
    forecast3: "Прогноз Kp индекса для",
    forecast3suffix: "на 3 дня (по 3-часовым интервалам)",
    loading: "Загрузка прогноза...",
    unavailable: "Данные прогноза недоступны.",
    max: "макс. Kp",
    forecast3Foot1: "Прогноз Kp индекса для города",
    forecast3Foot2: "от NOAA Space Weather Prediction Center. Время — киевское",
    forecast27: "Прогноз Kp на 27 дней —",
    forecast27Foot1: "27-дневный прогноз Kp индекса для города",
    forecast27Foot2: "от NOAA SWPC. Точность снижается с каждым днём — используйте для общего планирования.",
    airQuality: "Качество воздуха",
    currentMetrics: "Текущие показатели",
    wind: "Ветер",
    humidity: "Влажность",
    pressure: "Давление",
    cloudiness: "Облачность",
    uv: "UV индекс",
    kpIndex: "Kp индекс",
    high: "Высокая",
    medium: "Умеренная",
    lowHumidity: "Низкая",
    overcast: "Сплошная",
    variable: "Переменная",
    clear: "Малооблачно",
    uvVeryHigh: "Очень высокий",
    uvHigh: "Высокий",
    uvMedium: "Умеренный",
    uvLow: "Низкий",
    aboutPage: "О странице",
    cityNotFound: "Город не найден",
    srOnlyHeading: "Магнитные бури в",
    srOnlySuffix: "погода и качество воздуха",
    geoActivityStatus: "Статус геомагнитной активности в",
    forecast3Aria: "Прогноз Kp индекса на 3 дня",
    forecast27Aria: "Прогноз Kp на 27 дней",
    seoHeading: "Магнитные бури в",
    today: "сегодня",
    currentKp: "Текущий Kp индекс",
    stormLevel: "уровень геомагнитной бури",
    forecastRange: "Прогнозируемый диапазон Kp за сутки",
    radioBlackout: "Шкала радиозатемнений",
    radiationStorm: "шкала радиационных бурь",
    temperature: "Температура воздуха",
    windSpeed: "ветер",
    airIndex: "Индекс качества воздуха AQI",
    dataSource: "Данные",
    popularInRegion: "Популярные города",
    hydrometWarning: "Предупреждение гидрометцентра",
    hydrometSource: "Источник: УкрГМЦ",
    hydrometUnavailable: "Предупреждение временно недоступно",
    home: "Главная",
    breadcrumbAria: "Навигация по странице",
  },
  pl: {
    calm: "Spokojnie",
    low: "Niska aktywność",
    moderate: "Umiarkowana burza",
    strong: "Silna burza",
    extreme: "Ekstremalna burza",
    geoSituation: "Sytuacja geomagnetyczna w",
    sunriseSunset: "Wschód / Zachód słońca",
    sunrise: "Wschód",
    sunset: "Zachód",
    dayLength: "Długość dnia",
    coordinates: "Współrzędne",
    latitude: "Szerokość",
    longitude: "Długość",
    timezone: "Strefa czasowa",
    radiation: "Tło promieniowania",
    normal: "W normie",
    forecast3: "Prognoza indeksu Kp dla",
    forecast3suffix: "na 3 dni (co 3 godziny)",
    loading: "Ładowanie prognozy...",
    unavailable: "Dane prognozy są chwilowo niedostępne.",
    max: "maks. Kp",
    forecast3Foot1: "Prognoza indeksu Kp dla miasta",
    forecast3Foot2: "od NOAA Space Weather Prediction Center. Czas lokalny",
    forecast27: "Prognoza Kp na 27 dni —",
    forecast27Foot1: "27-dniowa prognoza indeksu Kp dla miasta",
    forecast27Foot2: "od NOAA SWPC. Dokładność maleje z każdym dniem — traktuj ją jako orientacyjną.",
    airQuality: "Jakość powietrza",
    currentMetrics: "Aktualne wskaźniki",
    wind: "Wiatr",
    humidity: "Wilgotność",
    pressure: "Ciśnienie",
    cloudiness: "Zachmurzenie",
    uv: "Indeks UV",
    kpIndex: "Indeks Kp",
    high: "Wysoka",
    medium: "Umiarkowana",
    lowHumidity: "Niska",
    overcast: "Duże",
    variable: "Zmienne",
    clear: "Małe",
    uvVeryHigh: "Bardzo wysoki",
    uvHigh: "Wysoki",
    uvMedium: "Umiarkowany",
    uvLow: "Niski",
    aboutPage: "O stronie",
    cityNotFound: "Nie znaleziono miasta",
    srOnlyHeading: "Burze magnetyczne w",
    srOnlySuffix: "pogoda i jakość powietrza",
    geoActivityStatus: "Status aktywności geomagnetycznej w",
    forecast3Aria: "Prognoza indeksu Kp na 3 dni",
    forecast27Aria: "Prognoza Kp na 27 dni",
    seoHeading: "Burze magnetyczne w",
    today: "dzisiaj",
    currentKp: "Aktualny indeks Kp",
    stormLevel: "poziom burzy geomagnetycznej",
    forecastRange: "Prognozowany zakres Kp w ciągu doby",
    radioBlackout: "Skala zakłóceń radiowych",
    radiationStorm: "skala burz radiacyjnych",
    temperature: "Temperatura powietrza",
    windSpeed: "wiatr",
    airIndex: "Indeks jakości powietrza AQI",
    dataSource: "Dane",
    popularInRegion: "Popularne miasta",
    hydrometWarning: "Ostrzeżenie hydrometcentrum",
    hydrometSource: "Źródło: UHGMC",
    hydrometUnavailable: "Ostrzeżenie chwilowo niedostępne",
    home: "Strona główna",
    breadcrumbAria: "Nawigacja po stronie",
  },
  ro: {
    calm: "Calm",
    low: "Activitate scăzută",
    moderate: "Furtună moderată",
    strong: "Furtună puternică",
    extreme: "Furtună extremă",
    geoSituation: "Situația geomagnetică în",
    sunriseSunset: "Răsărit / Apus",
    sunrise: "Răsărit",
    sunset: "Apus",
    dayLength: "Durata zilei",
    coordinates: "Coordonate",
    latitude: "Latitudine",
    longitude: "Longitudine",
    timezone: "Fus orar",
    radiation: "Fond de radiații",
    normal: "În limite normale",
    forecast3: "Prognoza indicelui Kp pentru",
    forecast3suffix: "pe 3 zile (intervale de 3 ore)",
    loading: "Se încarcă prognoza...",
    unavailable: "Datele prognozei sunt indisponibile.",
    max: "max. Kp",
    forecast3Foot1: "Prognoza indicelui Kp pentru orașul",
    forecast3Foot2: "de la NOAA Space Weather Prediction Center. Ora este locală",
    forecast27: "Prognoza Kp pe 27 de zile —",
    forecast27Foot1: "Prognoza indicelui Kp pe 27 de zile pentru orașul",
    forecast27Foot2: "de la NOAA SWPC. Precizia scade cu fiecare zi — folosește datele orientativ.",
    airQuality: "Calitatea aerului",
    currentMetrics: "Indicatori curenți",
    wind: "Vânt",
    humidity: "Umiditate",
    pressure: "Presiune",
    cloudiness: "Nebulozitate",
    uv: "Indice UV",
    kpIndex: "Indice Kp",
    high: "Ridicată",
    medium: "Moderată",
    lowHumidity: "Scăzută",
    overcast: "Închis",
    variable: "Variabil",
    clear: "Senin",
    uvVeryHigh: "Foarte ridicat",
    uvHigh: "Ridicat",
    uvMedium: "Moderat",
    uvLow: "Scăzut",
    aboutPage: "Despre pagină",
    cityNotFound: "Orașul nu a fost găsit",
    srOnlyHeading: "Furtuni magnetice în",
    srOnlySuffix: "vreme și calitatea aerului",
    geoActivityStatus: "Statusul activității geomagnetice în",
    forecast3Aria: "Prognoza indicelui Kp pe 3 zile",
    forecast27Aria: "Prognoza Kp pe 27 de zile",
    seoHeading: "Furtuni magnetice în",
    today: "astăzi",
    currentKp: "Indice Kp curent",
    stormLevel: "nivelul furtunii geomagnetice",
    forecastRange: "Intervalul Kp prognozat pentru zi",
    radioBlackout: "Scara blackout radio",
    radiationStorm: "scara furtunilor de radiații",
    temperature: "Temperatura aerului",
    windSpeed: "vânt",
    airIndex: "Indicele calității aerului AQI",
    dataSource: "Date",
    popularInRegion: "Orașe populare",
    hydrometWarning: "Avertizare hidrometeorologică",
    hydrometSource: "Sursa: serviciul meteo",
    hydrometUnavailable: "Avertizarea este temporar indisponibilă",
    home: "Acasă",
    breadcrumbAria: "Navigare pe pagină",
  },
  hu: {
    calm: "Nyugodt",
    low: "Alacsony aktivitás",
    moderate: "Mérsékelt vihar",
    strong: "Erős vihar",
    extreme: "Extrém vihar",
    geoSituation: "Geomágneses helyzet itt:",
    sunriseSunset: "Napkelte / napnyugta",
    sunrise: "Napkelte",
    sunset: "Napnyugta",
    dayLength: "Nappal hossza",
    coordinates: "Koordináták",
    latitude: "Szélesség",
    longitude: "Hosszúság",
    timezone: "Időzóna",
    radiation: "Sugárzási háttér",
    normal: "Normál tartományban",
    forecast3: "Kp-index előrejelzés:",
    forecast3suffix: "3 napra (3 órás bontásban)",
    loading: "Előrejelzés betöltése...",
    unavailable: "Az előrejelzési adatok nem érhetők el.",
    max: "max. Kp",
    forecast3Foot1: "Kp-index előrejelzés a városhoz:",
    forecast3Foot2: "NOAA Space Weather Prediction Center alapján. Helyi idő szerint",
    forecast27: "27 napos Kp-előrejelzés —",
    forecast27Foot1: "27 napos Kp-index előrejelzés a városhoz:",
    forecast27Foot2: "NOAA SWPC alapján. A pontosság napról napra csökken, ezért tájékoztató jellegű.",
    airQuality: "Levegőminőség",
    currentMetrics: "Aktuális mutatók",
    wind: "Szél",
    humidity: "Páratartalom",
    pressure: "Légnyomás",
    cloudiness: "Felhőzet",
    uv: "UV-index",
    kpIndex: "Kp-index",
    high: "Magas",
    medium: "Mérsékelt",
    lowHumidity: "Alacsony",
    overcast: "Borult",
    variable: "Változó",
    clear: "Derült",
    uvVeryHigh: "Nagyon magas",
    uvHigh: "Magas",
    uvMedium: "Mérsékelt",
    uvLow: "Alacsony",
    aboutPage: "Az oldalról",
    cityNotFound: "A város nem található",
    srOnlyHeading: "Mágneses viharok itt:",
    srOnlySuffix: "időjárás és levegőminőség",
    geoActivityStatus: "Geomágneses aktivitás állapota itt:",
    forecast3Aria: "3 napos Kp-index előrejelzés",
    forecast27Aria: "27 napos Kp-előrejelzés",
    seoHeading: "Mágneses viharok itt:",
    today: "ma",
    currentKp: "Aktuális Kp-index",
    stormLevel: "geomágneses vihar szintje",
    forecastRange: "Várható napi Kp-tartomány",
    radioBlackout: "Rádiózavar skála",
    radiationStorm: "sugárzási vihar skála",
    temperature: "Levegő hőmérséklete",
    windSpeed: "szél",
    airIndex: "AQI levegőminőségi index",
    dataSource: "Adatok",
    popularInRegion: "Népszerű városok",
    hydrometWarning: "HungaroMet figyelmeztetés",
    hydrometSource: "Forrás: HungaroMet",
    hydrometUnavailable: "A figyelmeztetés átmenetileg nem érhető el",
    home: "Főoldal",
    breadcrumbAria: "Oldalnavigáció",
  },
  bg: {
    calm: "Спокойно",
    low: "Ниска активност",
    moderate: "Умерена буря",
    strong: "Силна буря",
    extreme: "Екстремна буря",
    geoSituation: "Геомагнитна обстановка в",
    sunriseSunset: "Изгрев / залез на слънцето",
    sunrise: "Изгрев",
    sunset: "Залез",
    dayLength: "Продължителност на деня",
    coordinates: "Координати",
    latitude: "Ширина",
    longitude: "Дължина",
    timezone: "Часова зона",
    radiation: "Радиационен фон",
    normal: "В границите на нормата",
    forecast3: "Прогноза за Kp индекс за",
    forecast3suffix: "за 3 дни (на 3-часови интервали)",
    loading: "Зареждане на прогнозата...",
    unavailable: "Данните за прогнозата не са налични.",
    max: "макс. Kp",
    forecast3Foot1: "Прогноза за Kp индекс за град",
    forecast3Foot2: "от NOAA Space Weather Prediction Center. Местно време",
    forecast27: "Прогноза за Kp за 27 дни —",
    forecast27Foot1: "27-дневна прогноза за Kp индекс за град",
    forecast27Foot2: "от NOAA SWPC. Точността намалява с всеки ден — използвайте за общо планиране.",
    airQuality: "Качество на въздуха",
    currentMetrics: "Текущи показатели",
    wind: "Вятър",
    humidity: "Влажност",
    pressure: "Налягане",
    cloudiness: "Облачност",
    uv: "UV индекс",
    kpIndex: "Kp индекс",
    high: "Висока",
    medium: "Умерена",
    lowHumidity: "Ниска",
    overcast: "Плътна",
    variable: "Променлива",
    clear: "Ясно",
    uvVeryHigh: "Много висок",
    uvHigh: "Висок",
    uvMedium: "Умерен",
    uvLow: "Нисък",
    aboutPage: "За страницата",
    cityNotFound: "Градът не е намерен",
    srOnlyHeading: "Магнитни бури в",
    srOnlySuffix: "време и качество на въздуха",
    geoActivityStatus: "Статус на геомагнитната активност в",
    forecast3Aria: "Прогноза за Kp индекс за 3 дни",
    forecast27Aria: "Прогноза за Kp за 27 дни",
    seoHeading: "Магнитни бури в",
    today: "днес",
    currentKp: "Текущ Kp индекс",
    stormLevel: "ниво на геомагнитната буря",
    forecastRange: "Прогнозиран диапазон на Kp за денонощие",
    radioBlackout: "Скала на радиозатъмненията",
    radiationStorm: "скала на радиационните бури",
    temperature: "Температура на въздуха",
    windSpeed: "вятър",
    airIndex: "Индекс за качество на въздуха AQI",
    dataSource: "Данни",
    popularInRegion: "Популярни градове",
    hydrometWarning: "Предупреждение от метеослужбата",
    hydrometSource: "Източник: НИМХ",
    hydrometUnavailable: "Предупреждението временно не е налично",
    home: "Начало",
    breadcrumbAria: "Навигация в страницата",
  },
  cs: {
    calm: "Klid",
    low: "Nízká aktivita",
    moderate: "Mírná bouře",
    strong: "Silná bouře",
    extreme: "Extrémní bouře",
    geoSituation: "Geomagnetická situace v",
    sunriseSunset: "Východ / západ slunce",
    sunrise: "Východ",
    sunset: "Západ",
    dayLength: "Délka dne",
    coordinates: "Souřadnice",
    latitude: "Zeměpisná šířka",
    longitude: "Zeměpisná délka",
    timezone: "Časové pásmo",
    radiation: "Radiační pozadí",
    normal: "V mezích normy",
    forecast3: "Předpověď indexu Kp pro",
    forecast3suffix: "na 3 dny (v 3hodinových intervalech)",
    loading: "Načítání předpovědi...",
    unavailable: "Data předpovědi nejsou k dispozici.",
    max: "max. Kp",
    forecast3Foot1: "Předpověď indexu Kp pro město",
    forecast3Foot2: "od NOAA Space Weather Prediction Center. Místní čas",
    forecast27: "Předpověď Kp na 27 dní —",
    forecast27Foot1: "27denní předpověď indexu Kp pro město",
    forecast27Foot2: "od NOAA SWPC. Přesnost každým dnem klesá — používejte pro obecné plánování.",
    airQuality: "Kvalita ovzduší",
    currentMetrics: "Aktuální ukazatele",
    wind: "Vítr",
    humidity: "Vlhkost",
    pressure: "Tlak",
    cloudiness: "Oblačnost",
    uv: "UV index",
    kpIndex: "Index Kp",
    high: "Vysoká",
    medium: "Mírná",
    lowHumidity: "Nízká",
    overcast: "Zataženo",
    variable: "Proměnlivá",
    clear: "Jasno",
    uvVeryHigh: "Velmi vysoký",
    uvHigh: "Vysoký",
    uvMedium: "Mírný",
    uvLow: "Nízký",
    aboutPage: "O stránce",
    cityNotFound: "Město nenalezeno",
    srOnlyHeading: "Magnetické bouře v",
    srOnlySuffix: "počasí a kvalita ovzduší",
    geoActivityStatus: "Stav geomagnetické aktivity v",
    forecast3Aria: "Předpověď indexu Kp na 3 dny",
    forecast27Aria: "Předpověď Kp na 27 dní",
    seoHeading: "Magnetické bouře v",
    today: "dnes",
    currentKp: "Aktuální index Kp",
    stormLevel: "úroveň geomagnetické bouře",
    forecastRange: "Předpokládaný rozsah Kp za den",
    radioBlackout: "Stupnice rádiových výpadků",
    radiationStorm: "stupnice radiačních bouří",
    temperature: "Teplota vzduchu",
    windSpeed: "vítr",
    airIndex: "Index kvality ovzduší AQI",
    dataSource: "Data",
    popularInRegion: "Oblíbená města",
    hydrometWarning: "Výstraha meteorologické služby",
    hydrometSource: "Zdroj: ČHMÚ",
    hydrometUnavailable: "Výstraha je dočasně nedostupná",
    home: "Domů",
    breadcrumbAria: "Navigace na stránce",
  },
} as const;

const getKpStatus = (kp: number, locale: SiteLocale) => {
  const t = copy[locale];
  if (kp <= 2) return { label: t.calm, color: "hsl(145, 80%, 45%)" };
  if (kp <= 3) return { label: t.low, color: "hsl(55, 90%, 50%)" };
  if (kp <= 5) return { label: t.moderate, color: "hsl(35, 100%, 55%)" };
  if (kp <= 7) return { label: t.strong, color: "hsl(15, 90%, 50%)" };
  return { label: t.extreme, color: "hsl(0, 80%, 55%)" };
};

function toUkRegionGenitive(title: string) {
  const overrides: Record<string, string> = {
    "м. Київ": "Києва",
    "Автономна Республіка Крим": "Автономної Республіки Крим",
  };

  if (overrides[title]) return overrides[title];

  return title
    .replace("ька область", "ької області")
    .replace("цька область", "цької області")
    .replace("зька область", "зької області")
    .replace("ська область", "ської області");
}

function toRuRegionGenitive(title: string) {
  const overrides: Record<string, string> = {
    "г. Киев": "Киева",
    "Автономная Республика Крым": "Автономной Республики Крым",
  };

  if (overrides[title]) return overrides[title];

  return title
    .replace("ькая область", "ькой области")
    .replace("цкая область", "цкой области")
    .replace("зкая область", "зкой области")
    .replace("ская область", "ской области");
}

function getWindDirection(deg: number, locale: SiteLocale): string {
  const dirs = locale === "ru"
    ? ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]
    : locale === "hu"
      ? ["É", "ÉK", "K", "DK", "D", "DNY", "NY", "ÉNY"]
    : locale === "pl" || locale === "ro"
      ? ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
      : ["Пн", "ПнСх", "Сх", "ПдСх", "Пд", "ПдЗх", "Зх", "ПнЗх"];
  return dirs[Math.round(deg / 45) % 8];
}

function MiniCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub: string; color?: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-3 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" style={color ? { color } : undefined} />
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function AqiItem({ label, value, unit, warn }: { label: string; value: number; unit: string; warn: boolean }) {
  return (
    <div className="rounded-md bg-muted/30 p-3 space-y-1">
      <span className="font-mono text-[10px] text-muted-foreground uppercase">{label}</span>
      <p className={`font-mono text-lg font-bold ${warn ? "text-destructive" : "text-foreground"}`}>
        {Math.round(value * 10) / 10}
      </p>
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

interface CityPageProps {
  slug?: string;
  locale?: LegacyLocale;
  initialWeather?: CityWeatherResult | null;
  initialSunTimes?: CitySunTimesPayload | null;
  initialKp?: KpEntry[] | null;
  initialScales?: NoaaScales | null;
  initialForecast3?: KpForecastEntry[] | null;
}

const CityPage = ({ slug, locale = "uk", initialWeather, initialSunTimes, initialKp, initialScales, initialForecast3 }: CityPageProps) => {
  const resolvedSlug =
    slug ??
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).at(-1)
      : undefined);
  const cityBase = resolvedSlug
    ? locale === "pl"
      ? getCityByPlSlug(resolvedSlug)
      : locale === "ro"
        ? getCityByMdSlug(resolvedSlug)
      : locale === "hu"
        ? getCityByHuSlug(resolvedSlug)
      : locale === "bg"
        ? getCityByBgSlug(resolvedSlug)
      : locale === "cs"
        ? getCityByCsSlug(resolvedSlug)
      : getCityBySlug(resolvedSlug)
    : undefined;
  const city = cityBase ? (locale === "ru" ? getLocalizedCity(cityBase, "ru") : cityBase) : undefined;
  const t = copy[locale];
  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-MD" : locale === "hu" ? "hu-HU" : locale === "bg" ? "bg-BG" : locale === "cs" ? "cs-CZ" : "uk-UA";

  const { data, isLoading } = useCityWeather(city?.lat, city?.lon, city?.timezone, initialWeather ?? undefined, locale);
  const { data: sunTimes } = useCitySunTimes({
    lat: city?.lat ?? 50.4501,
    lon: city?.lon ?? 30.5234,
    timezone: city?.timezone ?? "Europe/Kyiv",
    locale,
    fallback: initialSunTimes
      ? { sunrise: initialSunTimes.sunrise, sunset: initialSunTimes.sunset }
      : data?.current
        ? { sunrise: data.current.sunrise, sunset: data.current.sunset }
        : null,
  });
  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: scales } = useNoaaScales(initialScales ?? undefined);
  const { data: forecast, isLoading: forecastLoading } = useKpForecast(initialForecast3 ?? undefined);
  const { data: forecast27 = [], isLoading: forecast27Loading } = useKpForecast27Day();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const kpStatus = getKpStatus(latestKp, locale);
  const regionGroup = cityBase
    ? UKRAINE_REGION_GROUPS.find((group) => group.slugs.includes(cityBase.slug))
    : undefined;
  const regionTitle = regionGroup
    ? locale === "ru"
      ? regionGroup.titleRu
      : regionGroup.titleUk
    : "";
  const regionTitleForHeading = regionTitle
    ? locale === "ru"
      ? toRuRegionGenitive(regionTitle)
      : locale === "pl"
        ? regionTitle
        : toUkRegionGenitive(regionTitle)
    : "";
  const popularRegionTitle = regionTitleForHeading
    ? locale === "ru"
      ? `${t.popularInRegion} ${regionTitleForHeading}`
      : locale === "pl"
        ? `${t.popularInRegion} ${regionTitleForHeading}`
        : `${t.popularInRegion} ${regionTitleForHeading}`
    : t.popularInRegion;
  const popularRegionCities =
    locale === "pl" || locale === "ro" || locale === "hu" || locale === "bg" || locale === "cs" || !regionGroup || !cityBase
      ? []
      : regionGroup.slugs
          .filter((candidateSlug) => candidateSlug !== cityBase.slug)
          .map((candidateSlug) => ALL_UK_CITIES.find((candidate) => candidate.slug === candidateSlug))
          .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
          .map((candidate) => {
            const localized = locale === "ru" ? getLocalizedCity(candidate, "ru") : candidate;
            const href = locale === "ru" ? `/ru/city/${getRuCitySlug(candidate)}` : `/city/${candidate.slug}`;
            return { name: localized.name, href };
          });
  const oblastPaths = regionGroup && locale !== "pl" && locale !== "ro" && locale !== "hu" && locale !== "bg" && locale !== "cs" ? getOblastPathsByKey(regionGroup.key) : null;
  const oblastHref =
    locale === "ru"
      ? oblastPaths?.ru
      : locale === "uk"
        ? oblastPaths?.uk
        : null;
  const oblastName =
    regionGroup && locale !== "pl" && locale !== "ro" && locale !== "hu" && locale !== "bg" && locale !== "cs"
      ? getOblastTitle(locale === "ru" ? "ru" : "uk", regionGroup.key) ?? regionTitle
      : null;
  const homeHref = locale === "ru" ? "/ru" : locale === "pl" ? "/pl" : locale === "ro" ? "/ro" : locale === "hu" ? "/hu" : locale === "bg" ? "/bg" : locale === "cs" ? "/cs" : "/";
  const cityHref = locale === "ru" ? `/ru/city/${getRuCitySlug(cityBase)}` : locale === "pl" ? `/pl/city/${city.slug}` : locale === "ro" ? `/ro/city/${city.slug}` : locale === "hu" ? `/hu/city/${city.slug}` : locale === "bg" ? `/bg/city/${city.slug}` : locale === "cs" ? `/cs/city/${city.slug}` : `/city/${city.slug}`;
  const countryName = locale === "ro" ? city.country : null;
  const countryHref = locale === "ro" && city.countrySlug ? `/ro/country/${city.countrySlug}` : null;
  const breadcrumbItems = [
    { name: t.home, url: absoluteUrl(homeHref) },
    ...(countryName && countryHref ? [{ name: countryName, url: absoluteUrl(countryHref) }] : []),
    ...(oblastHref && oblastName ? [{ name: oblastName, url: absoluteUrl(oblastHref) }] : []),
    { name: city.name, url: absoluteUrl(cityHref) },
  ];
  const uhmcRegionCode = locale === "pl" || locale === "ro" || locale === "hu" || locale === "bg" || locale === "cs" ? null : getUhmcRegionCode(regionGroup?.key);
  const hungaroMetCounty = locale === "hu" ? getHungaroMetCountyForCity(city.slug) : null;
  const { data: uhmcWarning } = useQuery({
    queryKey: ["uhmc-warning", uhmcRegionCode, locale],
    queryFn: async () => {
      const response = await fetch(`/api/uhmc-warning?regionCode=${uhmcRegionCode}&locale=${locale}`);
      if (!response.ok) {
        throw new Error("Failed to load UHMC warning");
      }
      return response.json() as Promise<{
        status: "none" | "active";
        updatedAt: string | null;
        level: number | null;
        types: string[];
        periods: string[];
        details: string[];
        summary: string;
        sourceUrl: string;
      }>;
    },
    enabled: Boolean(uhmcRegionCode),
    staleTime: 15 * 60 * 1000,
  });
  const { data: hungaroMetWarning } = useQuery({
    queryKey: ["hungaromet-warning", hungaroMetCounty],
    queryFn: async () => {
      const response = await fetch(`/api/hungaromet-warning?county=${encodeURIComponent(hungaroMetCounty ?? "")}`);
      if (!response.ok) {
        throw new Error("Failed to load HungaroMet warning");
      }
      return response.json() as Promise<{
        status: "none" | "active";
        updatedAt: string | null;
        level: number | null;
        types: string[];
        periods: string[];
        details: string[];
        summary: string;
        sourceUrl: string;
      }>;
    },
    enabled: Boolean(hungaroMetCounty),
    staleTime: 15 * 60 * 1000,
  });
  const regionalWarning = locale === "hu" ? hungaroMetWarning : uhmcWarning;
  const regionalWarningSource =
    locale === "hu"
      ? "https://www.met.hu/idojaras/veszelyjelzes/figyelmezteto_elorejelzes_mara/"
      : "https://www.meteo.gov.ua/ua/Meteorolohichni-poperedzhennya";

  const todayDate = new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric" });
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: city.timezone });
  const todayMaxKp = forecast?.length
    ? Math.max(
        ...forecast
          .filter((entry) => {
            const date = new Date(entry.time_tag.includes("Z") ? entry.time_tag : `${entry.time_tag}Z`);
            return date.toLocaleDateString("sv-SE", { timeZone: city.timezone }) === todayKey;
          })
          .map((entry) => entry.kp),
        0
      )
    : 0;
  const cityMagneticKp = Math.max(latestKp, todayMaxKp);
  const cityHourlyPressures = data?.hourly?.map((entry) => entry.pressure).filter((value) => Number.isFinite(value)) ?? [];
  const dynamicDescription = city
    ? locale === "ru"
      ? `Магнитные бури в ${city.nameGenitive} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Прогноз, погода, качество воздуха в реальном времени.`
      : locale === "pl"
        ? `Burze magnetyczne w ${city.nameGenitive} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Prognoza, pogoda i jakość powietrza w czasie rzeczywistym.`
        : locale === "ro"
          ? `Furtuni magnetice în ${city.nameGenitive}, ${city.country ?? "Moldova"} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Prognoză, vreme și calitatea aerului în timp real.`
        : locale === "hu"
          ? `${city.name} mágneses vihar előrejelzése ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Időjárás, napkelte, napnyugta és levegőminőség valós időben.`
          : locale === "bg"
            ? `Магнитни бури в ${city.name} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Прогноза, време и качество на въздуха в реално време.`
          : locale === "cs"
            ? `Magnetické bouře v ${city.name} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Předpověď, počasí a kvalita ovzduší v reálném čase.`
          : `Магнітні бурі в ${city.nameGenitive} ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Прогноз, погода, якість повітря в реальному часі.`
    : "";

  if (!city) return null;

  const cityGenitive =
    locale === "uk" || locale === "ru"
      ? getCityGenitive(cityBase!.slug, city.name, locale)
      : city.nameGenitive;

  // t.geoSituation bakes in "в"; swap for the euphonic в/у (uk) or в/во (ru)
  // form chosen by the sound the locative city name begins with.
  const geoSituationLabel =
    locale === "uk"
      ? `${t.geoSituation.replace(/ в$/, "")} ${ukPreposition(city.nameGenitive)}`
      : locale === "ru"
        ? `${t.geoSituation.replace(/ в$/, "")} ${ruPreposition(city.nameGenitive)}`
        : t.geoSituation;

  const today = new Date().toLocaleDateString(localeTag, {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: city.timezone,
  });

  const regionLabel =
    locale === "uk"
      ? ukGeoContext(cityBase!.slug)
      : locale === "ru"
        ? ruGeoContext(cityBase!.slug)
        : locale === "pl"
          ? getRegionForCity("pl", city.slug)?.titleIn ?? "Polsce"
          : locale === "ro"
            ? getRegionForCity("ro", city.slug)?.titleIn ?? city.country ?? "Moldova"
            : locale === "hu"
              ? getRegionForCity("hu", city.slug)?.titleIn ?? "Magyarországon"
              : locale === "bg"
                ? getRegionForCity("bg", city.slug)?.titleIn ?? "България"
                : locale === "cs"
                  ? getRegionForCity("cs", city.slug)?.titleIn ?? "Česku"
                  : city.country ?? "";

  const seoContent = getCitySeoContent({
    locale,
    name: city.name,
    locative: city.nameGenitive,
    genitive: cityGenitive,
    preposition:
      locale === "uk" ? ukPreposition(city.nameGenitive) : locale === "ru" ? ruPreposition(city.nameGenitive) : "",
    latLabel: city.latLabel,
    lonLabel: city.lonLabel,
    lat: city.lat,
    utcOffset: city.utcOffset,
    timezone: city.timezone,
    regionLabel,
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="official-page-main" role="main">
        <div className="official-page-shell space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
              })),
            }),
          }}
        />
        <h1 className="sr-only">
          {t.srOnlyHeading} {city.nameGenitive} — {t.srOnlySuffix}
        </h1>

        <nav
          aria-label={t.breadcrumbAria}
          className="official-page-breadcrumb gap-x-2 gap-y-1 text-xs"
        >
          <Link href={homeHref} className="transition-colors hover:text-primary">
            {t.home}
          </Link>
          {countryName ? (
            <>
              <span>/</span>
              {countryHref ? (
                <Link href={countryHref} className="transition-colors hover:text-primary">
                  {countryName}
                </Link>
              ) : (
                <span className="transition-colors">{countryName}</span>
              )}
            </>
          ) : null}
          {oblastHref && oblastName ? (
            <>
              <span>/</span>
              <Link href={oblastHref} className="transition-colors hover:text-primary">
                {oblastName}
              </Link>
            </>
          ) : null}
          <span>/</span>
          <span className="font-medium text-foreground">{city.name}</span>
        </nav>

        {/* Storm Banner + Sidebar */}
        <section
          className="space-y-4 xl:hidden"
          aria-label={`${t.geoActivityStatus} ${city.nameGenitive}`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-glow-cyan bg-card/50 px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">
                {geoSituationLabel} {city.nameGenitive} — {today}
              </h2>
            </div>
            <div className="flex-1 [&>div]:rounded-t-none">
              <StormStatusBanner initialKp={initialKp} initialScales={initialScales} initialForecast={initialForecast3} />
            </div>
          </div>

          <MobileAdsenseSlot />

          <CityStormFeelingSummary locale={locale} />

          {data?.current ? (
            <CityImpactPanel
              locale={locale}
              magneticKp={cityMagneticKp}
              currentPressure={data.current.pressure}
              hourlyPressures={cityHourlyPressures}
            />
          ) : null}

          {/* Sun + Coordinates + Radiation */}
          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3 flex flex-col text-sm">
            {data?.current && (
              <div className="space-y-1.5">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <Sun className="h-3.5 w-3.5 text-primary" />
                  {t.sunriseSunset}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunrise className="h-3.5 w-3.5 text-amber-400" />{t.sunrise}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunrise ?? data.current.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunset className="h-3.5 w-3.5 text-orange-400" />{t.sunset}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunset ?? data.current.sunset)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/30 pt-1.5">
                  <span className="text-muted-foreground">{t.dayLength}</span>
                  <span className="font-mono font-medium text-foreground">{sunTimes?.dayLength ?? data.current.dayLength}</span>
                </div>
              </div>
            )}
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {t.coordinates}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.latitude}</span>
                <span className="font-mono text-foreground">{city.latLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.longitude}</span>
                <span className="font-mono text-foreground">{city.lonLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.timezone}</span>
                <span className="font-mono text-foreground">{city.utcOffset}</span>
              </div>
            </div>
            {locale === "pl" || locale === "ro" || locale === "bg" || locale === "cs" ? (
              <div className="space-y-1.5 border-t border-border/30 pt-2">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  {t.radiation}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-foreground">0.08–0.14</span>
                  <span className="text-[10px] text-muted-foreground">µSv/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-storm-quiet/15 border border-storm-quiet/30 px-2 py-0.5 text-[9px] font-medium text-storm-quiet">{t.normal}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 border-t border-border/30 pt-2">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                  {t.hydrometWarning}
                </h3>
                <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-3 shadow-[0_0_0_1px_rgba(0,255,255,0.03)]">
                  <p className="font-mono text-sm font-bold text-foreground">
                    {regionalWarning?.summary ?? t.hydrometUnavailable}
                  </p>
                  {regionalWarning?.details?.[0] ? (
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {regionalWarning.details[0]}
                    </p>
                  ) : null}
                  {regionalWarning?.updatedAt ? (
                    <p className="text-[10px] text-muted-foreground">
                      {regionalWarning.updatedAt}
                    </p>
                  ) : null}
                  <Link
                    href={regionalWarning?.sourceUrl ?? regionalWarningSource}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-[10px] font-medium text-primary hover:text-primary/80"
                  >
                    {t.hydrometSource}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          className="hidden xl:grid xl:grid-cols-[5.5fr_5.6fr] gap-4 items-stretch"
          aria-label={`${t.geoActivityStatus} ${city.nameGenitive}`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-glow-cyan bg-card/50 px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">
                {geoSituationLabel} {city.nameGenitive} — {today}
              </h2>
            </div>
            <div className="flex-1 [&>div]:rounded-t-none">
              <StormStatusBanner initialKp={initialKp} initialScales={initialScales} initialForecast={initialForecast3} />
            </div>
          </div>

          <div className="grid min-h-full grid-rows-[auto_1fr] gap-4 xl:grid-cols-[2.6fr_3fr]">
          <CityStormFeelingSummary locale={locale} className="xl:col-span-2" />

          {data?.current ? (
            <CityImpactPanel
              locale={locale}
              magneticKp={cityMagneticKp}
              currentPressure={data.current.pressure}
              hourlyPressures={cityHourlyPressures}
            />
          ) : null}

          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3 flex flex-col text-sm">
            {data?.current && (
              <div className="space-y-1.5">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <Sun className="h-3.5 w-3.5 text-primary" />
                  {t.sunriseSunset}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunrise className="h-3.5 w-3.5 text-amber-400" />{t.sunrise}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunrise ?? data.current.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunset className="h-3.5 w-3.5 text-orange-400" />{t.sunset}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunset ?? data.current.sunset)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/30 pt-1.5">
                  <span className="text-muted-foreground">{t.dayLength}</span>
                  <span className="font-mono font-medium text-foreground">{sunTimes?.dayLength ?? data.current.dayLength}</span>
                </div>
              </div>
            )}
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {t.coordinates}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.latitude}</span>
                <span className="font-mono text-foreground">{city.latLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.longitude}</span>
                <span className="font-mono text-foreground">{city.lonLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.timezone}</span>
                <span className="font-mono text-foreground">{city.utcOffset}</span>
              </div>
            </div>
            {locale === "pl" || locale === "ro" || locale === "bg" || locale === "cs" ? (
              <div className="space-y-1.5 border-t border-border/30 pt-2">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  {t.radiation}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-foreground">0.08–0.14</span>
                  <span className="text-[10px] text-muted-foreground">µSv/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-storm-quiet/15 border border-storm-quiet/30 px-2 py-0.5 text-[9px] font-medium text-storm-quiet">{t.normal}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 border-t border-border/30 pt-2">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                  {t.hydrometWarning}
                </h3>
                <div className="space-y-1 rounded-xl border border-primary/20 bg-primary/5 p-3 shadow-[0_0_0_1px_rgba(0,255,255,0.03)]">
                  <p className="font-mono text-sm font-bold text-foreground">
                    {regionalWarning?.summary ?? t.hydrometUnavailable}
                  </p>
                  {regionalWarning?.details?.[0] ? (
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {regionalWarning.details[0]}
                    </p>
                  ) : null}
                  {regionalWarning?.updatedAt ? (
                    <p className="text-[10px] text-muted-foreground">
                      {regionalWarning.updatedAt}
                    </p>
                  ) : null}
                  <Link
                    href={regionalWarning?.sourceUrl ?? regionalWarningSource}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-[10px] font-medium text-primary hover:text-primary/80"
                  >
                    {t.hydrometSource}
                  </Link>
                </div>
              </div>
            )}
          </div>
          </div>
        </section>

        <div className="xl:hidden">
          <MobileAdsenseSlot />
        </div>

        {/* 3-day Kp forecast (starting from tomorrow) */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label={t.forecast3Aria}>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.forecast3} {cityGenitive} {t.forecast3suffix}
            </h2>
          </div>
          {forecastLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">{t.loading}</p>
          ) : forecast && forecast.length > 0 ? (() => {
            const nowDate = new Date();
            const tomorrowDate = new Date(nowDate);
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const tomorrowKey = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, "0")}-${String(tomorrowDate.getDate()).padStart(2, "0")}`;
            const filtered = forecast.filter((row) => {
              const d = new Date(row.time_tag + "Z");
              const dateStr = d.toLocaleDateString("sv-SE", { timeZone: city.timezone });
              return dateStr >= tomorrowKey;
            });
            const grouped = new Map<string, typeof forecast>();
            filtered.forEach((row) => {
              const dateKey = new Date(row.time_tag + "Z").toLocaleDateString(localeTag, {
                weekday: "short", day: "numeric", month: "short", timeZone: city.timezone,
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
                    <div key={dateLabel} className="rounded-lg border border-border/50 bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-medium text-foreground">{dateLabel}</span>
                        <span className={cn(
                          "text-[10px] font-mono px-1.5 py-0.5 rounded",
                          maxKpRound >= 5 ? "bg-storm-severe/20 text-storm-severe" :
                          maxKpRound >= 4 ? "bg-storm-moderate/20 text-storm-moderate" :
                          "bg-storm-quiet/20 text-storm-quiet"
                        )}>
                          {t.max} {maxKp.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-2.5 sm:space-y-1.5">
                        {rows.map((row, j) => {
                          const kpVal = Math.min(9, Math.max(0, Math.round(row.kp)));
                          return (
                            <div key={j} className="flex items-center gap-2.5 sm:gap-2">
                              <span className="w-12 sm:w-10 shrink-0 text-[13px] sm:text-[11px] text-muted-foreground font-mono">
                                {new Date(row.time_tag + "Z").toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: city.timezone })}
                              </span>
                              <div className="flex-1 h-5 sm:h-3 rounded-md sm:rounded-sm bg-muted/20 overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-md sm:rounded-sm transition-all",
                                    kpVal >= 5 ? "bg-storm-severe" :
                                    kpVal >= 4 ? "bg-storm-moderate" :
                                    kpVal >= 2 ? "bg-storm-minor" :
                                    "bg-storm-quiet"
                                  )}
                                  style={{ width: `${(row.kp / 9) * 100}%` }}
                                />
                              </div>
                              <span className={cn(
                                "font-mono font-bold w-9 sm:w-7 text-sm sm:text-xs text-right shrink-0",
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
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.forecast3Foot1} {city.name} ({city.lat.toFixed(2)}°N) {t.forecast3Foot2} ({city.utcOffset}).
          </p>
        </section>

        {/* 27-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label={t.forecast27Aria}>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.forecast27} {city.name}
            </h2>
          </div>
          {forecast27Loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">{t.loading}</p>
          ) : forecast27.length > 0 ? (
            <div className="grid grid-cols-7 gap-1.5">
              {forecast27.map((day) => {
                const d = new Date(day.date);
                const isToday = day.date === new Date().toISOString().slice(0, 10);
                const kpColor = day.kp >= 5
                  ? "city-forecast27-card city-forecast27-card-severe"
                  : day.kp >= 4
                    ? "city-forecast27-card city-forecast27-card-minor"
                    : "city-forecast27-card city-forecast27-card-quiet";
                return (
                  <div
                    key={day.date}
                    className={cn("rounded-md border p-1.5 text-center text-[10px] font-mono transition-colors", kpColor, isToday && "ring-1 ring-primary")}
                    title={`${day.date}: Kp ${day.kp}`}
                  >
                    <div className="text-[10px] font-medium opacity-80">{d.toLocaleDateString(localeTag, { weekday: "narrow" })}</div>
                    <div className="text-xs font-bold">{d.getDate()}</div>
                    <div className="text-[9px] font-semibold opacity-90">Kp {day.kp}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t.unavailable}</p>
          )}
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.forecast27Foot1} {city.name} ({city.lat.toFixed(2)}°N) {t.forecast27Foot2}
          </p>
        </section>

        {/* Air Quality */}
        {data?.airQuality && (
          <section aria-label={t.airQuality}>
            <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">{t.airQuality}</h2>
                <span
                  className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${getAqiLabel(data.airQuality.aqi, locale).color}15`,
                    color: getAqiLabel(data.airQuality.aqi, locale).color,
                  }}
                >
                  {getAqiLabel(data.airQuality.aqi, locale).label} • AQI {data.airQuality.aqi}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <AqiItem label="PM2.5" value={data.airQuality.pm25} unit={locale === "uk" || locale === "ru" ? "мкг/м³" : "µg/m³"} warn={data.airQuality.pm25 > 25} />
                <AqiItem label="PM10" value={data.airQuality.pm10} unit={locale === "uk" || locale === "ru" ? "мкг/м³" : "µg/m³"} warn={data.airQuality.pm10 > 50} />
                <AqiItem label="NO₂" value={data.airQuality.no2} unit={locale === "uk" || locale === "ru" ? "мкг/м³" : "µg/m³"} warn={data.airQuality.no2 > 40} />
                <AqiItem label="O₃" value={data.airQuality.o3} unit={locale === "uk" || locale === "ru" ? "мкг/м³" : "µg/m³"} warn={data.airQuality.o3 > 100} />
              </div>
              <div className="space-y-1">
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="flex-1 bg-[hsl(145,80%,45%)]" />
                  <div className="flex-1 bg-[hsl(100,70%,45%)]" />
                  <div className="flex-1 bg-[hsl(55,90%,50%)]" />
                  <div className="flex-1 bg-[hsl(35,100%,55%)]" />
                  <div className="flex-1 bg-[hsl(0,80%,55%)]" />
                </div>
                <div className="relative h-0">
                  <div
                    className="absolute -top-3 w-0.5 h-4 bg-foreground rounded-full transition-all"
                    style={{ left: `${Math.min(data.airQuality.aqi, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Metric cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : data?.current ? (
          <section aria-label={t.currentMetrics}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <MiniCard icon={Wind} label={t.wind} value={`${Math.round(data.current.windSpeed)} ${locale === "uk" || locale === "ru" ? "км/г" : "km/h"}`} sub={getWindDirection(data.current.windDirection, locale)} />
              <MiniCard icon={Droplets} label={t.humidity} value={`${data.current.humidity}%`} sub={data.current.humidity > 80 ? t.high : data.current.humidity > 50 ? t.medium : t.lowHumidity} />
              <MiniCard icon={Gauge} label={t.pressure} value={`${Math.round(data.current.pressure)}`} sub={locale === "uk" || locale === "ru" ? "гПа" : "hPa"} />
              <MiniCard icon={Cloud} label={t.cloudiness} value={`${data.current.cloudCover}%`} sub={data.current.cloudCover > 80 ? t.overcast : data.current.cloudCover > 40 ? t.variable : t.clear} />
              <MiniCard icon={Sun} label={t.uv} value={`${Math.round(data.current.uvIndex)}`} sub={data.current.uvIndex > 8 ? t.uvVeryHigh : data.current.uvIndex > 5 ? t.uvHigh : data.current.uvIndex > 2 ? t.uvMedium : t.uvLow} />
              <MiniCard icon={Activity} label={t.kpIndex} value={`${Math.round(latestKp)}`} sub={kpStatus.label} color={kpStatus.color} />
            </div>
          </section>
        ) : null}

        {popularRegionCities.length > 0 && (
          <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label={popularRegionTitle}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {popularRegionTitle}
              </h2>
            </div>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
              {popularRegionCities.map((regionCity) => (
                <Link
                  key={regionCity.href}
                  href={regionCity.href}
                  className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  {regionCity.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic SEO text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label={t.aboutPage}>
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.seoHeading} {city.nameGenitive} {t.today}, {new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric", timeZone: city.timezone })}
          </h2>
          {(() => {
            const todayForecast = forecast?.filter((e) => {
              const d = new Date(e.time_tag + "Z");
              const dateStr = d.toLocaleDateString("sv-SE", { timeZone: city.timezone });
              const nowStr = new Date().toLocaleDateString("sv-SE", { timeZone: city.timezone });
              return dateStr === nowStr;
            }) || [];
            const kpValues = todayForecast.map((e) => e.kp);
            const minKp = kpValues.length ? Math.min(...kpValues) : 0;
            const maxKp = kpValues.length ? Math.max(...kpValues) : 0;
            const rScale = scales?.r?.Scale ?? 0;
            const sScale = scales?.s?.Scale ?? 0;
            const dateStr = new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric", timeZone: city.timezone });

            return (
              <p>
                {city.name}, {dateStr}. {t.currentKp} — {latestKp.toFixed(1)}, {t.stormLevel} — G{gLevel}.
                {kpValues.length > 0 && ` ${t.forecastRange}: ${minKp.toFixed(1)}–${maxKp.toFixed(1)}.`}
                {" "}{t.radioBlackout} — R{rScale}, {t.radiationStorm} — S{sScale}.
                {data?.current && ` ${t.temperature} — ${Math.round(data.current.temperature)}°C, ${t.pressure.toLowerCase()} — ${Math.round(data.current.pressure)} ${locale === "uk" || locale === "ru" ? "гПа" : "hPa"}, ${t.humidity.toLowerCase()} — ${data.current.humidity}%, ${t.windSpeed} — ${Math.round(data.current.windSpeed)} ${locale === "uk" || locale === "ru" ? "км/год" : "km/h"} (${getWindDirection(data.current.windDirection, locale)}).`}
                {data?.airQuality && ` ${t.airIndex} — ${data.airQuality.aqi}, PM2.5 — ${(Math.round(data.airQuality.pm25 * 10) / 10)} ${locale === "uk" || locale === "ru" ? "мкг/м³" : "µg/m³"}.`}
                {" "}{t.dataSource}: NOAA SWPC, Open-Meteo.
              </p>
            );
          })()}
          {seoContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <div className="not-prose mt-2 rounded-lg border border-border/50 bg-card p-6" aria-label={CITY_FAQ_HEADING[locale]}>
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {CITY_FAQ_HEADING[locale]}
              </h2>
            </div>
            <div className="space-y-4">
              {seoContent.faq.map((item, index) => (
                <details key={index} className="group border-b border-border/20 pb-3 last:border-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground transition-colors hover:text-primary">
                    {item.question}
                    <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: seoContent.faq.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              }),
            }}
          />
        </section>
        </div>
      </main>
    </div>
  );
};

export default CityPage;
