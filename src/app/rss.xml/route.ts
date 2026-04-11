import { getLatestNews } from "@/lib/server-news";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

export async function GET() {
  const news = await getLatestNews(30, "uk").catch(() => []);

  const items = news
    .map((item) => {
      const url = absoluteUrl(`/news/${item.slug || item.id}`);
      const description = item.description ?? "";
      return `<item>
  <title><![CDATA[${item.title}]]></title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(item.published_at).toUTCString()}</pubDate>
  <description><![CDATA[${description}]]></description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${SITE_NAME}</title>
  <link>${absoluteUrl("/")}</link>
  <description>Новини магнітних бур та космічної погоди</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
