import { useEffect } from "react";

/**
 * Sets document title, meta description, canonical URL, and OG tags for the current page.
 * Restores defaults on unmount.
 */
export function usePageMeta(title: string, description: string, canonicalPath?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") || "";
    meta?.setAttribute("content", description);

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    const prevOgTitle = ogTitle?.getAttribute("content") || "";
    const prevOgDesc = ogDesc?.getAttribute("content") || "";
    const prevOgUrl = ogUrl?.getAttribute("content") || "";
    const prevTwTitle = twTitle?.getAttribute("content") || "";
    const prevTwDesc = twDesc?.getAttribute("content") || "";
    const prevCanonical = canonical?.getAttribute("href") || "";

    ogTitle?.setAttribute("content", title);
    ogDesc?.setAttribute("content", description);
    twTitle?.setAttribute("content", title);
    twDesc?.setAttribute("content", description);

    if (canonicalPath) {
      const fullUrl = `https://magnitca.com${canonicalPath}`;
      ogUrl?.setAttribute("content", fullUrl);
      canonical?.setAttribute("href", fullUrl);
    }

    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDescription);
      ogTitle?.setAttribute("content", prevOgTitle);
      ogDesc?.setAttribute("content", prevOgDesc);
      ogUrl?.setAttribute("content", prevOgUrl);
      twTitle?.setAttribute("content", prevTwTitle);
      twDesc?.setAttribute("content", prevTwDesc);
      canonical?.setAttribute("href", prevCanonical);
    };
  }, [title, description, canonicalPath]);
}
