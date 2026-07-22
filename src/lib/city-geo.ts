import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";

type CityRegion = { regionKey: string; titleUk: string; titleRu: string };

const REGION_BY_CITY_SLUG = new Map<string, CityRegion>();
for (const group of UKRAINE_REGION_GROUPS) {
  for (const slug of group.slugs) {
    if (!REGION_BY_CITY_SLUG.has(slug)) {
      REGION_BY_CITY_SLUG.set(slug, {
        regionKey: group.key,
        titleUk: group.titleUk,
        titleRu: group.titleRu,
      });
    }
  }
}

export function getCityRegion(slug: string): CityRegion | null {
  return REGION_BY_CITY_SLUG.get(slug) ?? null;
}

// City-level "regions" (Kyiv, Sevastopol) carry a "м."/"г." prefix. For those the
// city name already conveys the place, so we fall back to the country only to
// avoid a redundant "(м. Київ, Україна)" tail.
function isCityRegionTitle(title: string) {
  return title.startsWith("м. ") || title.startsWith("г. ");
}

// Geographic context appended to city meta so each page reads as a distinct
// local place (region + country) instead of colliding with the oblast page and
// with same-named settlements — mirrors how large weather portals differentiate
// thousands of near-identical city pages.
export function ukGeoContext(slug: string): string {
  const region = getCityRegion(slug);
  if (!region || isCityRegionTitle(region.titleUk)) return "Україна";
  return `${region.titleUk}, Україна`;
}

export function ruGeoContext(slug: string): string {
  const region = getCityRegion(slug);
  if (!region || isCityRegionTitle(region.titleRu)) return "Украина";
  return `${region.titleRu}, Украина`;
}
