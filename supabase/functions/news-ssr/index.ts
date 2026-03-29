import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://magnitca.com";

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const BOT_UA = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|whatsapp|telegram|viber|snapchat|discord/i;

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "";
  const isBot = BOT_UA.test(ua);

  // For non-bots, redirect to SPA
  if (!isBot) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${SITE_URL}/news/${slug}` },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let { data: article } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!article) {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("id", slug)
        .maybeSingle();
      article = data;
    }

    if (!article) {
      return new Response("Not found", { status: 404 });
    }

    const title = escapeHtml(article.meta_title || article.title);
    const description = escapeHtml(
      article.meta_description ||
        article.content?.slice(0, 160)?.replace(/<[^>]*>/g, "")?.replace(/\n/g, " ") ||
        ""
    );
    const canonicalUrl = `${SITE_URL}/news/${article.slug || article.id}`;
    const imageUrl = article.image_url || `${SITE_URL}/og-image.png`;

    // Clean content for display
    const contentText = article.content?.replace(/<[^>]*>/g, "") || "";

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      datePublished: article.published_at,
      dateModified: article.updated_at,
      description: article.meta_description || contentText.slice(0, 160),
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      publisher: { "@type": "Organization", name: "Магнітка", url: SITE_URL },
      ...(article.image_url
        ? { image: { "@type": "ImageObject", url: article.image_url } }
        : {}),
    });

    const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Магнітка</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:site_name" content="Магнітка">
  <meta property="og:locale" content="uk_UA">
  <meta property="article:published_time" content="${article.published_at}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

  <script type="application/ld+json">${jsonLd}</script>

  <meta http-equiv="refresh" content="0;url=${canonicalUrl}">
</head>
<body>
  <h1>${title}</h1>
  <p>${escapeHtml(contentText.slice(0, 500))}</p>
  <a href="${canonicalUrl}">Читати на Магнітці</a>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("News SSR error:", error);
    return new Response("Error", { status: 500 });
  }
});
