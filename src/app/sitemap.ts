import type { MetadataRoute } from "next";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_PL } from "@/data/cities-pl";
import { getRuCitySlug } from "@/data/cities-ru";
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

  return [
    ...staticPages,
    ...ruStaticPages,
    ...plStaticPages,
    ...cityPages,
    ...ruCityPages,
    ...plCityPages,
    ...oblastPages,
    ...ruOblastPages,
    ...newsPages,
    ...ruNewsPages,
  ];
}
