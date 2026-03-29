// Cloudflare Worker — SEO proxy for news articles
// Deploy this worker and add route: *magnitca.com/news/*

const SSR_ENDPOINT = "https://vipkucckidwsurcgxedw.supabase.co/functions/v1/news-ssr";

const BOT_UA = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|whatsapp|telegram|viber|snapchat|discord/i;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // Only intercept /news/<slug> paths for bots
    const match = url.pathname.match(/^\/news\/([^/]+)\/?$/);
    if (!match) {
      return fetch(request);
    }

    const isBot = BOT_UA.test(ua);
    if (!isBot) {
      return fetch(request);
    }

    const slug = match[1];

    try {
      const ssrUrl = `${SSR_ENDPOINT}?slug=${encodeURIComponent(slug)}`;
      const ssrResponse = await fetch(ssrUrl, {
        headers: {
          "User-Agent": ua,
        },
      });

      if (!ssrResponse.ok) {
        // Fallback to origin
        return fetch(request);
      }

      const html = await ssrResponse.text();
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    } catch (e) {
      console.error("SSR proxy error:", e);
      return fetch(request);
    }
  },
};
