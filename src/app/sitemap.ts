import type { MetadataRoute } from "next";
import { CITIES } from "@/data/cities";
import { getRuCitySlug } from "@/data/cities-ru";
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
    "/ru/privacy",
    "/ru/cookies",
    "/ru/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/ru" ? "hourly" : "daily",
    priority: path === "/ru" ? 0.9 : 0.6,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/city/${city.slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const ruCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/ru/city/${getRuCitySlug(city)}`,
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

  return [...staticPages, ...ruStaticPages, ...cityPages, ...ruCityPages, ...newsPages, ...ruNewsPages];
}
