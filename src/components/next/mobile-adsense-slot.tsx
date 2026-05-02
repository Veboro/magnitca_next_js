"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function MobileAdsenseSlot() {
  const initializedRef = useRef(false);
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (isDev) return;
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
      <div className="rounded-lg bg-card/60 p-1">
        {isDev ? (
          <div className="rounded-md border border-border/40 bg-card p-4">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Ad Preview</span>
              <span>Mobile</span>
            </div>
            <div className="flex min-h-[250px] items-center justify-center rounded-md border border-border/30 bg-background/50 text-center">
              <div className="space-y-2 px-4">
                <div className="text-sm font-medium text-foreground">Magnitca_kvadrart</div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  Локальний макет рекламного блока для перевірки ширини, відступів і того, чи нічого не обрізається.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ins
            className="adsbygoogle block"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8479466204387928"
            data-ad-slot="8225742476"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
