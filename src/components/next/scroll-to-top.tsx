"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Next's App Router doesn't always reset the scroll position on navigation
 * (especially when the new page streams / loads content async), so pages could
 * open scrolled down. This forces the top on forward navigation while leaving
 * back/forward restoration and in-page hash anchors alone.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isBackForward = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isBackForward.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Let the browser restore the previous position on Back/Forward.
    if (isBackForward.current) {
      isBackForward.current = false;
      return;
    }
    // Don't fight an in-page #anchor jump.
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
