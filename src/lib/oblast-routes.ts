import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";

export type OblastRouteLocale = "uk" | "ru";

type OblastRouteEntry = {
  regionKey: string;
  slugUk: string;
  slugRu: string;
};

export const OBLAST_ROUTE_MAP: OblastRouteEntry[] = [
  { regionKey: "kyiv-city", slugUk: "kyiv", slugRu: "kiev" },
  { regionKey: "vinnytsia", slugUk: "vinnytska", slugRu: "vinnitskaya" },
  { regionKey: "volyn", slugUk: "volynska", slugRu: "volynskaya" },
  { regionKey: "dnipropetrovsk", slugUk: "dnipropetrovska", slugRu: "dnepropetrovskaya" },
  { regionKey: "donetsk", slugUk: "donetska", slugRu: "donetskaya" },
  { regionKey: "zhytomyr", slugUk: "zhytomyrska", slugRu: "zhitomirskaya" },
  { regionKey: "zakarpattia", slugUk: "zakarpatska", slugRu: "zakarpatskaya" },
  { regionKey: "zaporizhzhia", slugUk: "zaporizka", slugRu: "zaporozhskaya" },
  { regionKey: "ivano-frankivsk", slugUk: "ivano-frankivska", slugRu: "ivano-frankovskaya" },
  { regionKey: "kyiv-oblast", slugUk: "kyivska", slugRu: "kievskaya" },
  { regionKey: "kirovohrad", slugUk: "kirovohradska", slugRu: "kirovogradskaya" },
  { regionKey: "luhansk", slugUk: "luhanska", slugRu: "luganskaya" },
  { regionKey: "lviv", slugUk: "lvivska", slugRu: "lvovskaya" },
  { regionKey: "mykolaiv", slugUk: "mykolaivska", slugRu: "nikolaevskaya" },
  { regionKey: "odesa", slugUk: "odeska", slugRu: "odesskaya" },
  { regionKey: "poltava", slugUk: "poltavska", slugRu: "poltavskaya" },
  { regionKey: "rivne", slugUk: "rivnenska", slugRu: "rovenskaya" },
  { regionKey: "sumy", slugUk: "sumska", slugRu: "sumskaya" },
  { regionKey: "ternopil", slugUk: "ternopilska", slugRu: "ternopolskaya" },
  { regionKey: "kharkiv", slugUk: "kharkivska", slugRu: "kharkovskaya" },
  { regionKey: "kherson", slugUk: "khersonska", slugRu: "khersonskaya" },
  { regionKey: "khmelnytskyi", slugUk: "khmelnytska", slugRu: "khmelnitskaya" },
  { regionKey: "cherkasy", slugUk: "cherkaska", slugRu: "cherkasskaya" },
  { regionKey: "chernivtsi", slugUk: "chernivetska", slugRu: "chernovitskaya" },
  { regionKey: "chernihiv", slugUk: "chernihivska", slugRu: "chernigovskaya" },
  { regionKey: "crimea", slugUk: "krym", slugRu: "krym" },
];

const ROUTE_BY_KEY = new Map(OBLAST_ROUTE_MAP.map((item) => [item.regionKey, item]));
const UK_ROUTE_BY_SLUG = new Map(OBLAST_ROUTE_MAP.map((item) => [item.slugUk, item]));
const RU_ROUTE_BY_SLUG = new Map(OBLAST_ROUTE_MAP.map((item) => [item.slugRu, item]));

function toUkRegionGenitive(title: string) {
  const overrides: Record<string, string> = {
    "м. Київ": "Києві",
    "Автономна Республіка Крим": "Автономній Республіці Крим",
  };
  if (overrides[title]) return overrides[title];
  return title
    .replace("ька область", "ькій області")
    .replace("цька область", "цькій області")
    .replace("зька область", "зькій області")
    .replace("ська область", "ській області");
}

function toRuRegionPrepositional(title: string) {
  const overrides: Record<string, string> = {
    "г. Киев": "Киеве",
    "Автономная Республика Крым": "Автономной Республике Крым",
  };
  if (overrides[title]) return overrides[title];
  return title
    .replace("цкая область", "цкой области")
    .replace("ская область", "ской области");
}

export function getOblastRouteByKey(regionKey: string) {
  return ROUTE_BY_KEY.get(regionKey) ?? null;
}

export function getOblastRouteBySlug(locale: OblastRouteLocale, slug: string) {
  return (locale === "ru" ? RU_ROUTE_BY_SLUG : UK_ROUTE_BY_SLUG).get(slug) ?? null;
}

export function getOblastPathsByKey(regionKey: string) {
  const route = getOblastRouteByKey(regionKey);
  if (!route) return null;
  return {
    uk: `/oblast/${route.slugUk}`,
    ru: `/ru/oblast/${route.slugRu}`,
  };
}

export function getOblastRegion(regionKey: string) {
  return UKRAINE_REGION_GROUPS.find((item) => item.key === regionKey) ?? null;
}

export function getOblastHeading(locale: OblastRouteLocale, regionKey: string) {
  const region = getOblastRegion(regionKey);
  if (!region) return null;
  return locale === "ru" ? toRuRegionPrepositional(region.titleRu) : toUkRegionGenitive(region.titleUk);
}

export function getOblastTitle(locale: OblastRouteLocale, regionKey: string) {
  const region = getOblastRegion(regionKey);
  if (!region) return null;
  return locale === "ru" ? region.titleRu : region.titleUk;
}

