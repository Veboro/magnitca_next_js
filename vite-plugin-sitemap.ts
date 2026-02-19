import type { Plugin } from "vite";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = "https://magnitca.com";

const STATIC_PAGES = [
  { loc: "/", changefreq: "hourly", priority: "1.0" },
  { loc: "/news", changefreq: "hourly", priority: "0.9" },
  { loc: "/calendar", changefreq: "daily", priority: "0.8" },
  { loc: "/faq", changefreq: "weekly", priority: "0.7" },
  { loc: "/test", changefreq: "monthly", priority: "0.6" },
  { loc: "/about", changefreq: "monthly", priority: "0.5" },
  { loc: "/contacts", changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy", changefreq: "monthly", priority: "0.3" },
];

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.warn("[sitemap] Missing Supabase env vars, using static pages only");
          writeSitemap([], resolve("dist", "sitemap.xml"));
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: news, error } = await supabase
          .from("news")
          .select("slug, id, published_at, updated_at, telegram_sent")
          .eq("telegram_sent", false)
          .order("published_at", { ascending: false })
          .limit(1000);

        if (error) {
          console.warn("[sitemap] Failed to fetch news:", error.message);
        }

        writeSitemap(news ?? [], resolve("dist", "sitemap.xml"));
        console.log(`[sitemap] Generated with ${STATIC_PAGES.length} static + ${(news ?? []).length} news URLs`);
      } catch (e) {
        console.warn("[sitemap] Error:", e);
        writeSitemap([], resolve("dist", "sitemap.xml"));
      }
    },
  };
}

function writeSitemap(news: any[], outPath: string) {
  const staticUrls = STATIC_PAGES.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ).join("\n");

  const newsUrls = news
    .map((item) => {
      const slug = item.slug || item.id;
      const lastmod = (item.updated_at || item.published_at).split("T")[0];
      return `  <url>
    <loc>${SITE_URL}/news/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${newsUrls}
</urlset>`;

  writeFileSync(outPath, xml, "utf-8");
}
