import type { MetadataRoute } from "next";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_MD, RO_COUNTRIES } from "@/data/cities-md";
import { CITIES_HU } from "@/data/cities-hu";
import { CITIES_PL } from "@/data/cities-pl";
import { getRuCitySlug } from "@/data/cities-ru";
import { getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { OBLAST_ROUTE_MAP } from "@/lib/oblast-routes";
import { getLatestNews } from "@/lib/server-news";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/news",
    "/test",
    "/calendar",
    "/kp-index",
    "/solar-wind",
    "/moon-calendar",
    "/sunrise",
    "/sunrise-tomorrow",
    "/sunset",
    "/sunset-tomorrow",
    "/faq",
    "/about",
    "/contacts",
    "/cities",
    "/privacy",
    "/cookies",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency: path === "" || path === "/news" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  const ruStaticPages: MetadataRoute.Sitemap = [
    "/ru",
    "/ru/test",
    "/ru/calendar",
    "/ru/kp-index",
    "/ru/solar-wind",
    "/ru/moon-calendar",
    "/ru/sunrise",
    "/ru/sunrise-tomorrow",
    "/ru/sunset",
    "/ru/sunset-tomorrow",
    "/ru/faq",
    "/ru/about",
    "/ru/contacts",
    "/ru/cities",
    "/ru/privacy",
    "/ru/cookies",
    "/ru/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/ru" ? "hourly" : "daily",
    priority: path === "/ru" ? 0.9 : 0.6,
  }));

  const plStaticPages: MetadataRoute.Sitemap = [
    "/pl",
    "/pl/test",
    "/pl/calendar",
    "/pl/kp-index",
    "/pl/solar-wind",
    "/pl/moon-calendar",
    "/pl/sunrise",
    "/pl/sunrise-tomorrow",
    "/pl/sunset",
    "/pl/sunset-tomorrow",
    "/pl/faq",
    "/pl/about",
    "/pl/contacts",
    "/pl/privacy",
    "/pl/cookies",
    "/pl/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/pl" ? "hourly" : "daily",
    priority: path === "/pl" ? 0.85 : 0.6,
  }));

  const roStaticPages: MetadataRoute.Sitemap = [
    "/ro",
    "/ro/test",
    "/ro/calendar",
    "/ro/kp-index",
    "/ro/solar-wind",
    "/ro/moon-calendar",
    "/ro/faq",
    "/ro/about",
    "/ro/contacts",
    "/ro/privacy",
    "/ro/cookies",
    "/ro/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/ro" ? "hourly" : "daily",
    priority: path === "/ro" ? 0.85 : 0.6,
  }));

  const huStaticPages: MetadataRoute.Sitemap = [
    "/hu",
    "/hu/test",
    "/hu/calendar",
    "/hu/kp-index",
    "/hu/solar-wind",
    "/hu/sunrise",
    "/hu/sunrise-tomorrow",
    "/hu/sunset",
    "/hu/sunset-tomorrow",
    "/hu/moon-calendar",
    "/hu/faq",
    "/hu/about",
    "/hu/contacts",
    "/hu/privacy",
    "/hu/cookies",
    "/hu/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/hu" ? "hourly" : "daily",
    priority: path === "/hu" ? 0.85 : 0.6,
  }));

  const enStaticPages: MetadataRoute.Sitemap = [
    "/en",
    "/en/test",
    "/en/calendar",
    "/en/kp-index",
    "/en/solar-wind",
    "/en/moon-calendar",
    "/en/faq",
    "/en/about",
    "/en/contacts",
    "/en/privacy",
    "/en/cookies",
    "/en/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/en" ? "hourly" : "daily",
    priority: path === "/en" ? 0.85 : 0.6,
  }));

  const cityPages: MetadataRoute.Sitemap = ALL_UK_CITIES.map((city) => ({
    url: `${SITE_URL}/city/${city.slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const ruCityPages: MetadataRoute.Sitemap = ALL_UK_CITIES.map((city) => ({
    url: `${SITE_URL}/ru/city/${getRuCitySlug(city)}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const plCityPages: MetadataRoute.Sitemap = CITIES_PL.map((city) => ({
    url: `${SITE_URL}/pl/city/${city.slug}`,
    changeFrequency: "hourly",
    priority: 0.75,
  }));

  const roCityPages: MetadataRoute.Sitemap = CITIES_MD.map((city) => ({
    url: `${SITE_URL}/ro/city/${city.slug}`,
    changeFrequency: "hourly",
    priority: 0.75,
  }));

  const huCityPages: MetadataRoute.Sitemap = CITIES_HU.map((city) => ({
    url: `${SITE_URL}/hu/city/${city.slug}`,
    changeFrequency: "hourly",
    priority: 0.75,
  }));

  const roCountryPages: MetadataRoute.Sitemap = RO_COUNTRIES.map((country) => ({
    url: `${SITE_URL}/ro/country/${country.slug}`,
    changeFrequency: "daily",
    priority: 0.65,
  }));

  const roCountrySunPages: MetadataRoute.Sitemap = RO_COUNTRIES.flatMap((country) =>
    ["sunrise", "sunrise-tomorrow", "sunset", "sunset-tomorrow"].map((sunPage) => ({
      url: `${SITE_URL}/ro/country/${country.slug}/${sunPage}`,
      changeFrequency: "daily" as const,
      priority: 0.62,
    }))
  );

  const oblastPages: MetadataRoute.Sitemap = OBLAST_ROUTE_MAP.map((route) => ({
    url: `${SITE_URL}/oblast/${route.slugUk}`,
    changeFrequency: "hourly",
    priority: 0.75,
  }));

  const ruOblastPages: MetadataRoute.Sitemap = OBLAST_ROUTE_MAP.map((route) => ({
    url: `${SITE_URL}/ru/oblast/${route.slugRu}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const moonMonthRoutes = getMoonMonthRoutes2026();
  const moonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefUk}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const ruMoonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefRu}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const plMoonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefPl}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const roMoonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefRo}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const huMoonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefHu}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const enMoonCalendarPages: MetadataRoute.Sitemap = moonMonthRoutes.map((route) => ({
    url: `${SITE_URL}${route.hrefEn}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const newsPages = await getLatestNews(1000, "uk")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  const ruNewsPages = await getLatestNews(1000, "ru")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/ru/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  const plNewsPages = await getLatestNews(1000, "pl")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/pl/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  const roNewsPages = await getLatestNews(1000, "ro")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/ro/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  const huNewsPages = await getLatestNews(1000, "hu")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/hu/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  const enNewsPages = await getLatestNews(1000, "en")
    .then((items) =>
      items.map((item) => ({
        url: `${SITE_URL}/en/news/${item.slug || item.id}`,
        lastModified: item.published_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => []);

  return [
    ...staticPages,
    ...ruStaticPages,
    ...plStaticPages,
    ...roStaticPages,
    ...huStaticPages,
    ...enStaticPages,
    ...cityPages,
    ...ruCityPages,
    ...plCityPages,
    ...roCityPages,
    ...huCityPages,
    ...roCountryPages,
    ...roCountrySunPages,
    ...oblastPages,
    ...ruOblastPages,
    ...moonCalendarPages,
    ...ruMoonCalendarPages,
    ...plMoonCalendarPages,
    ...roMoonCalendarPages,
    ...huMoonCalendarPages,
    ...enMoonCalendarPages,
    ...newsPages,
    ...ruNewsPages,
    ...plNewsPages,
    ...roNewsPages,
    ...huNewsPages,
    ...enNewsPages,
  ];
}
