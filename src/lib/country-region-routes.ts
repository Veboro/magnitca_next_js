import type { CityConfig } from "@/data/cities";
import { CITIES_HU } from "@/data/cities-hu";
import { CITIES_MD } from "@/data/cities-md";
import { CITIES_PL } from "@/data/cities-pl";

export type CountryRegionLocale = "pl" | "ro" | "hu";
export type CountryRegionKind = "wojewodztwo" | "judet" | "raion" | "municipiu" | "regiune" | "varmegye";

export type CountryRegionRoute = {
  key: string;
  locale: CountryRegionLocale;
  kind: CountryRegionKind;
  slug: string;
  title: string;
  titleIn: string;
  country: string;
  countrySlug?: "romania" | "moldova";
  adminLabel: string;
  citySlugs: string[];
};

const PL_REGIONS: CountryRegionRoute[] = [
  { key: "pl-mazowieckie", locale: "pl", kind: "wojewodztwo", slug: "mazowieckie", title: "Województwo mazowieckie", titleIn: "województwie mazowieckim", country: "Polska", adminLabel: "województwo", citySlugs: ["warszawa", "radom", "plock"] },
  { key: "pl-malopolskie", locale: "pl", kind: "wojewodztwo", slug: "malopolskie", title: "Województwo małopolskie", titleIn: "województwie małopolskim", country: "Polska", adminLabel: "województwo", citySlugs: ["krakow"] },
  { key: "pl-dolnoslaskie", locale: "pl", kind: "wojewodztwo", slug: "dolnoslaskie", title: "Województwo dolnośląskie", titleIn: "województwie dolnośląskim", country: "Polska", adminLabel: "województwo", citySlugs: ["wroclaw"] },
  { key: "pl-wielkopolskie", locale: "pl", kind: "wojewodztwo", slug: "wielkopolskie", title: "Województwo wielkopolskie", titleIn: "województwie wielkopolskim", country: "Polska", adminLabel: "województwo", citySlugs: ["poznan"] },
  { key: "pl-pomorskie", locale: "pl", kind: "wojewodztwo", slug: "pomorskie", title: "Województwo pomorskie", titleIn: "województwie pomorskim", country: "Polska", adminLabel: "województwo", citySlugs: ["gdansk", "gdynia"] },
  { key: "pl-lodzkie", locale: "pl", kind: "wojewodztwo", slug: "lodzkie", title: "Województwo łódzkie", titleIn: "województwie łódzkim", country: "Polska", adminLabel: "województwo", citySlugs: ["lodz"] },
  { key: "pl-zachodniopomorskie", locale: "pl", kind: "wojewodztwo", slug: "zachodniopomorskie", title: "Województwo zachodniopomorskie", titleIn: "województwie zachodniopomorskim", country: "Polska", adminLabel: "województwo", citySlugs: ["szczecin"] },
  { key: "pl-lubelskie", locale: "pl", kind: "wojewodztwo", slug: "lubelskie", title: "Województwo lubelskie", titleIn: "województwie lubelskim", country: "Polska", adminLabel: "województwo", citySlugs: ["lublin"] },
  { key: "pl-podlaskie", locale: "pl", kind: "wojewodztwo", slug: "podlaskie", title: "Województwo podlaskie", titleIn: "województwie podlaskim", country: "Polska", adminLabel: "województwo", citySlugs: ["bialystok"] },
  { key: "pl-slaskie", locale: "pl", kind: "wojewodztwo", slug: "slaskie", title: "Województwo śląskie", titleIn: "województwie śląskim", country: "Polska", adminLabel: "województwo", citySlugs: ["katowice", "czestochowa", "bielsko-biala"] },
  { key: "pl-kujawsko-pomorskie", locale: "pl", kind: "wojewodztwo", slug: "kujawsko-pomorskie", title: "Województwo kujawsko-pomorskie", titleIn: "województwie kujawsko-pomorskim", country: "Polska", adminLabel: "województwo", citySlugs: ["bydgoszcz", "torun"] },
  { key: "pl-warminsko-mazurskie", locale: "pl", kind: "wojewodztwo", slug: "warminsko-mazurskie", title: "Województwo warmińsko-mazurskie", titleIn: "województwie warmińsko-mazurskim", country: "Polska", adminLabel: "województwo", citySlugs: ["olsztyn"] },
  { key: "pl-podkarpackie", locale: "pl", kind: "wojewodztwo", slug: "podkarpackie", title: "Województwo podkarpackie", titleIn: "województwie podkarpackim", country: "Polska", adminLabel: "województwo", citySlugs: ["rzeszow"] },
  { key: "pl-swietokrzyskie", locale: "pl", kind: "wojewodztwo", slug: "swietokrzyskie", title: "Województwo świętokrzyskie", titleIn: "województwie świętokrzyskim", country: "Polska", adminLabel: "województwo", citySlugs: ["kielce"] },
  { key: "pl-opolskie", locale: "pl", kind: "wojewodztwo", slug: "opolskie", title: "Województwo opolskie", titleIn: "województwie opolskim", country: "Polska", adminLabel: "województwo", citySlugs: ["opole"] },
  { key: "pl-lubuskie", locale: "pl", kind: "wojewodztwo", slug: "lubuskie", title: "Województwo lubuskie", titleIn: "województwie lubuskim", country: "Polska", adminLabel: "województwo", citySlugs: ["gorzow-wielkopolski", "zielona-gora"] },
];

const HU_REGIONS: CountryRegionRoute[] = [
  { key: "hu-budapest", locale: "hu", kind: "varmegye", slug: "budapest", title: "Budapest", titleIn: "Budapesten", country: "Magyarország", adminLabel: "főváros", citySlugs: ["budapest"] },
  { key: "hu-pest", locale: "hu", kind: "varmegye", slug: "pest", title: "Pest vármegye", titleIn: "Pest vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["erd", "dunakeszi", "szigetszentmiklos", "cegled", "vac", "godollo", "budaors", "szentendre", "gyal", "nagykoros"] },
  { key: "hu-hajdu-bihar", locale: "hu", kind: "varmegye", slug: "hajdu-bihar", title: "Hajdú-Bihar vármegye", titleIn: "Hajdú-Bihar vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["debrecen", "hajduboszormeny", "hajduszoboszlo"] },
  { key: "hu-csongrad-csanad", locale: "hu", kind: "varmegye", slug: "csongrad-csanad", title: "Csongrád-Csanád vármegye", titleIn: "Csongrád-Csanád vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["szeged", "hodmezovasarhely", "szentes"] },
  { key: "hu-borsod-abauj-zemplen", locale: "hu", kind: "varmegye", slug: "borsod-abauj-zemplen", title: "Borsod-Abaúj-Zemplén vármegye", titleIn: "Borsod-Abaúj-Zemplén vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["miskolc", "ozd", "kazincbarcika"] },
  { key: "hu-baranya", locale: "hu", kind: "varmegye", slug: "baranya", title: "Baranya vármegye", titleIn: "Baranya vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["pecs"] },
  { key: "hu-gyor-moson-sopron", locale: "hu", kind: "varmegye", slug: "gyor-moson-sopron", title: "Győr-Moson-Sopron vármegye", titleIn: "Győr-Moson-Sopron vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["gyor", "sopron", "mosonmagyarovar"] },
  { key: "hu-szabolcs-szatmar-bereg", locale: "hu", kind: "varmegye", slug: "szabolcs-szatmar-bereg", title: "Szabolcs-Szatmár-Bereg vármegye", titleIn: "Szabolcs-Szatmár-Bereg vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["nyiregyhaza"] },
  { key: "hu-bacs-kiskun", locale: "hu", kind: "varmegye", slug: "bacs-kiskun", title: "Bács-Kiskun vármegye", titleIn: "Bács-Kiskun vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["kecskemet", "baja", "kiskunfelegyhaza", "kiskunhalas"] },
  { key: "hu-fejer", locale: "hu", kind: "varmegye", slug: "fejer", title: "Fejér vármegye", titleIn: "Fejér vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["szekesfehervar", "dunaujvaros"] },
  { key: "hu-vas", locale: "hu", kind: "varmegye", slug: "vas", title: "Vas vármegye", titleIn: "Vas vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["szombathely"] },
  { key: "hu-jasz-nagykun-szolnok", locale: "hu", kind: "varmegye", slug: "jasz-nagykun-szolnok", title: "Jász-Nagykun-Szolnok vármegye", titleIn: "Jász-Nagykun-Szolnok vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["szolnok", "jaszbereny"] },
  { key: "hu-komarom-esztergom", locale: "hu", kind: "varmegye", slug: "komarom-esztergom", title: "Komárom-Esztergom vármegye", titleIn: "Komárom-Esztergom vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["tatabanya", "esztergom"] },
  { key: "hu-somogy", locale: "hu", kind: "varmegye", slug: "somogy", title: "Somogy vármegye", titleIn: "Somogy vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["kaposvar", "siofok"] },
  { key: "hu-veszprem", locale: "hu", kind: "varmegye", slug: "veszprem", title: "Veszprém vármegye", titleIn: "Veszprém vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["veszprem", "papa", "ajka"] },
  { key: "hu-bekes", locale: "hu", kind: "varmegye", slug: "bekes", title: "Békés vármegye", titleIn: "Békés vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["bekescsaba", "gyula", "oroshaza"] },
  { key: "hu-zala", locale: "hu", kind: "varmegye", slug: "zala", title: "Zala vármegye", titleIn: "Zala vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["zalaegerszeg", "nagykanizsa"] },
  { key: "hu-heves", locale: "hu", kind: "varmegye", slug: "heves", title: "Heves vármegye", titleIn: "Heves vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["eger", "gyongyos"] },
  { key: "hu-nograd", locale: "hu", kind: "varmegye", slug: "nograd", title: "Nógrád vármegye", titleIn: "Nógrád vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["salgotarjan"] },
  { key: "hu-tolna", locale: "hu", kind: "varmegye", slug: "tolna", title: "Tolna vármegye", titleIn: "Tolna vármegyében", country: "Magyarország", adminLabel: "vármegye", citySlugs: ["szekszard"] },
];

const MD_REGIONS: CountryRegionRoute[] = [
  { key: "md-chisinau", locale: "ro", kind: "municipiu", slug: "chisinau", title: "Municipiul Chișinău", titleIn: "municipiul Chișinău", country: "Moldova", countrySlug: "moldova", adminLabel: "municipiu", citySlugs: ["chisinau"] },
  { key: "md-balti", locale: "ro", kind: "municipiu", slug: "balti", title: "Municipiul Bălți", titleIn: "municipiul Bălți", country: "Moldova", countrySlug: "moldova", adminLabel: "municipiu", citySlugs: ["balti"] },
  { key: "md-tiraspol", locale: "ro", kind: "municipiu", slug: "tiraspol", title: "Municipiul Tiraspol", titleIn: "municipiul Tiraspol", country: "Moldova", countrySlug: "moldova", adminLabel: "municipiu", citySlugs: ["tiraspol"] },
  { key: "md-bender", locale: "ro", kind: "municipiu", slug: "bender", title: "Municipiul Bender / Tighina", titleIn: "municipiul Bender / Tighina", country: "Moldova", countrySlug: "moldova", adminLabel: "municipiu", citySlugs: ["bender"] },
  { key: "md-gagauzia", locale: "ro", kind: "regiune", slug: "gagauzia", title: "Găgăuzia", titleIn: "Găgăuzia", country: "Moldova", countrySlug: "moldova", adminLabel: "unitate autonomă", citySlugs: ["comrat", "ceadir-lunga", "vulcanesti"] },
  ...[
    "cahul", "edinet", "hincesti", "orhei", "soroca", "straseni", "ungheni", "anenii-noi", "basarabeasca", "briceni", "cantemir", "calarasi", "causeni", "cimislia", "criuleni", "donduseni", "drochia", "dubasari", "falesti", "floresti", "glodeni", "ialoveni", "leova", "nisporeni", "ocnita", "rezina", "riscani", "singerei", "soldanesti", "stefan-voda", "taraclia", "telenesti",
  ].map((slug) => {
    const city = CITIES_MD.find((item) => item.slug === slug);
    const title = city?.name ?? slug;
    return {
      key: `md-${slug}`,
      locale: "ro" as const,
      kind: "raion" as const,
      slug,
      title: `Raionul ${title}`,
      titleIn: `raionul ${title}`,
      country: "Moldova",
      countrySlug: "moldova" as const,
      adminLabel: "raion",
      citySlugs: [slug],
    };
  }),
];

const RO_REGIONS: CountryRegionRoute[] = [
  { key: "ro-bucuresti", locale: "ro", kind: "municipiu", slug: "bucuresti", title: "Municipiul București", titleIn: "municipiul București", country: "România", countrySlug: "romania", adminLabel: "municipiu", citySlugs: ["bucuresti"] },
  { key: "ro-ilfov", locale: "ro", kind: "judet", slug: "ilfov", title: "Județul Ilfov", titleIn: "județul Ilfov", country: "România", countrySlug: "romania", adminLabel: "județ", citySlugs: ["buftea"] },
  ...[
    ["alba", "Alba", "alba-iulia"],
    ["teleorman", "Teleorman", "alexandria"],
    ["arad", "Arad", "arad"],
    ["bacau", "Bacău", "bacau"],
    ["maramures", "Maramureș", "baia-mare"],
    ["bistrita-nasaud", "Bistrița-Năsăud", "bistrita"],
    ["botosani", "Botoșani", "botosani"],
    ["braila", "Brăila", "braila"],
    ["brasov", "Brașov", "brasov"],
    ["buzau", "Buzău", "buzau"],
    ["vaslui", "Vaslui", "vaslui"],
    ["galati", "Galați", "galati"],
    ["giurgiu", "Giurgiu", "giurgiu"],
    ["mehedinti", "Mehedinți", "drobeta-turnu-severin"],
    ["salaj", "Sălaj", "zalau"],
    ["calarasi", "Călărași", "calarasi-romania"],
    ["cluj", "Cluj", "cluj-napoca"],
    ["constanta", "Constanța", "constanta"],
    ["dolj", "Dolj", "craiova"],
    ["harghita", "Harghita", "miercurea-ciuc"],
    ["bihor", "Bihor", "oradea"],
    ["arges", "Argeș", "pitesti"],
    ["prahova", "Prahova", "ploiesti"],
    ["neamt", "Neamț", "piatra-neamt"],
    ["caras-severin", "Caraș-Severin", "resita"],
    ["valcea", "Vâlcea", "ramnicu-valcea"],
    ["satu-mare", "Satu Mare", "satu-mare"],
    ["sibiu", "Sibiu", "sibiu"],
    ["olt", "Olt", "slatina"],
    ["ialomita", "Ialomița", "slobozia"],
    ["suceava", "Suceava", "suceava"],
    ["covasna", "Covasna", "sfantu-gheorghe"],
    ["dambovita", "Dâmbovița", "targoviste"],
    ["gorj", "Gorj", "targu-jiu"],
    ["mures", "Mureș", "targu-mures"],
    ["timis", "Timiș", "timisoara"],
    ["tulcea", "Tulcea", "tulcea"],
    ["vrancea", "Vrancea", "focsani"],
    ["iasi", "Iași", "iasi"],
  ].map(([slug, title, citySlug]) => ({
    key: `ro-${slug}`,
    locale: "ro" as const,
    kind: "judet" as const,
    slug,
    title: `Județul ${title}`,
    titleIn: `județul ${title}`,
    country: "România",
    countrySlug: "romania" as const,
    adminLabel: "județ",
    citySlugs: [citySlug],
  })),
];

export const COUNTRY_REGION_ROUTES: CountryRegionRoute[] = [
  ...PL_REGIONS,
  ...RO_REGIONS,
  ...MD_REGIONS,
  ...HU_REGIONS,
];

const REGION_CITY_SOURCE: Record<CountryRegionLocale, CityConfig[]> = {
  pl: CITIES_PL,
  ro: CITIES_MD,
  hu: CITIES_HU,
};

export function getCountryRegionPath(region: Pick<CountryRegionRoute, "locale" | "kind" | "slug">) {
  if (region.locale === "pl") return `/pl/wojewodztwo/${region.slug}`;
  if (region.locale === "hu") return `/hu/varmegye/${region.slug}`;
  if (region.kind === "municipiu") return `/ro/municipiu/${region.slug}`;
  if (region.kind === "regiune") return `/ro/regiune/${region.slug}`;
  if (region.kind === "raion") return `/ro/raion/${region.slug}`;
  return `/ro/judet/${region.slug}`;
}

export function getCountryRegionsByLocale(locale: CountryRegionLocale, kind?: CountryRegionKind) {
  return COUNTRY_REGION_ROUTES.filter((region) => region.locale === locale && (!kind || region.kind === kind));
}

export function getCountryRegionBySlug(locale: CountryRegionLocale, kind: CountryRegionKind, slug: string) {
  return COUNTRY_REGION_ROUTES.find((region) => region.locale === locale && region.kind === kind && region.slug === slug) ?? null;
}

export function getCountryRegionCities(region: CountryRegionRoute) {
  const source = REGION_CITY_SOURCE[region.locale];
  const cityMap = new Map(source.map((city) => [city.slug, city]));
  return region.citySlugs
    .map((slug) => cityMap.get(slug))
    .filter((city): city is CityConfig => Boolean(city));
}

export function getCountryRegionCityHref(region: CountryRegionRoute, city: Pick<CityConfig, "slug">) {
  return `/${region.locale}/city/${city.slug}`;
}
