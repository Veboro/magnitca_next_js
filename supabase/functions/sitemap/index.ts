import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://magnitca.com";

const STATIC_PAGES = [
  { loc: "/", changefreq: "hourly", priority: "1.0" },
  { loc: "/news", changefreq: "hourly", priority: "0.9" },
  { loc: "/storm-calendar", changefreq: "daily", priority: "0.8" },
  { loc: "/faq", changefreq: "weekly", priority: "0.7" },
  { loc: "/meteo-test", changefreq: "monthly", priority: "0.6" },
  { loc: "/about", changefreq: "monthly", priority: "0.5" },
  { loc: "/contacts", changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy", changefreq: "monthly", priority: "0.3" },
];

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: news } = await supabase
      .from("news")
      .select("slug, id, published_at, updated_at")
      .order("published_at", { ascending: false })
      .limit(500);

    const staticUrls = STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ).join("\n");

    const newsUrls = (news ?? [])
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

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response("Sitemap generation failed", { status: 500 });
  }
});
