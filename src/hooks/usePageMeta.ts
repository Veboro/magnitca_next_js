import { useEffect } from "react";

/**
 * Sets document title and meta description for the current page.
 * Restores default title on unmount.
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;

    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") || "";

    if (meta) {
      meta.setAttribute("content", description);
    }

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');

    const prevOgTitle = ogTitle?.getAttribute("content") || "";
    const prevOgDesc = ogDesc?.getAttribute("content") || "";
    const prevTwTitle = twTitle?.getAttribute("content") || "";
    const prevTwDesc = twDesc?.getAttribute("content") || "";

    ogTitle?.setAttribute("content", title);
    ogDesc?.setAttribute("content", description);
    twTitle?.setAttribute("content", title);
    twDesc?.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDescription);
      ogTitle?.setAttribute("content", prevOgTitle);
      ogDesc?.setAttribute("content", prevOgDesc);
      twTitle?.setAttribute("content", prevTwTitle);
      twDesc?.setAttribute("content", prevTwDesc);
    };
  }, [title, description]);
}
