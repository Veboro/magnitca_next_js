import { useEffect } from "react";

function getOrCreateMeta(attr: string, value: string): HTMLMetaElement {
  let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (attr === "property") {
      el.setAttribute("property", value);
    } else {
      el.setAttribute("name", value);
    }
    document.head.appendChild(el);
  }
  return el;
}

/**
 * Sets document title, meta description, canonical URL, and OG/Twitter tags.
 * Creates missing tags if needed. Restores defaults on unmount.
 */
export function usePageMeta(title: string, description: string, canonicalPath?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const meta = getOrCreateMeta("name", "description");
    const prevDescription = meta.getAttribute("content") || "";
    meta.setAttribute("content", description);

    const ogTitle = getOrCreateMeta("property", "og:title");
    const ogDesc = getOrCreateMeta("property", "og:description");
    const ogUrl = getOrCreateMeta("property", "og:url");
    const twTitle = getOrCreateMeta("name", "twitter:title");
    const twDesc = getOrCreateMeta("name", "twitter:description");
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    const prevOgTitle = ogTitle.getAttribute("content") || "";
    const prevOgDesc = ogDesc.getAttribute("content") || "";
    const prevOgUrl = ogUrl.getAttribute("content") || "";
    const prevTwTitle = twTitle.getAttribute("content") || "";
    const prevTwDesc = twDesc.getAttribute("content") || "";
    const prevCanonical = canonical?.getAttribute("href") || "";

    ogTitle.setAttribute("content", title);
    ogDesc.setAttribute("content", description);
    twTitle.setAttribute("content", title);
    twDesc.setAttribute("content", description);

    if (canonicalPath) {
      const fullUrl = `https://magnitca.com${canonicalPath}`;
      ogUrl.setAttribute("content", fullUrl);
      canonical?.setAttribute("href", fullUrl);
    }

    return () => {
      document.title = prevTitle;
      meta.setAttribute("content", prevDescription);
      ogTitle.setAttribute("content", prevOgTitle);
      ogDesc.setAttribute("content", prevOgDesc);
      ogUrl.setAttribute("content", prevOgUrl);
      twTitle.setAttribute("content", prevTwTitle);
      twDesc.setAttribute("content", prevTwDesc);
      if (canonical) canonical.setAttribute("href", prevCanonical);
    };
  }, [title, description, canonicalPath]);
}
