"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function MobileAdsenseSlot() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch {
      // AdSense can throw before the global script is ready; fail quietly.
    }
  }, []);

  return (
    <div className="md:hidden">
      <div className="overflow-hidden rounded-lg border border-border/50 bg-card p-3 shadow-sm">
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8479466204387928"
          data-ad-slot="8225742476"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
