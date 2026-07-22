"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { getLocaleFromPathname, type SiteLocale } from "@/lib/locale";

const SHARE_LABEL: Record<SiteLocale, string> = {
  uk: "Поділитися",
  ru: "Поделиться",
  pl: "Udostępnij",
  ro: "Distribuie",
  hu: "Megosztás",
  en: "Share",
};

type ShareTarget = {
  key: string;
  label: string;
  color: string;
  href: (url: string, text: string) => string;
  icon: JSX.Element;
};

const SHARE_TARGETS: ShareTarget[] = [
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X",
    color: "#000000",
    href: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#229ED9",
    href: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M23.953 4.57a1.68 1.68 0 0 0-2.343-1.53L1.7 11.15c-1.17.45-1.16 1.11-.21 1.4l5.13 1.6 11.9-7.5c.56-.34 1.07-.15.65.19l-9.63 8.7-.37 5.4c.5 0 .72-.22.99-.48l2.38-2.3 4.94 3.64c.91.5 1.56.24 1.78-.84l3.23-15.16z" />
      </svg>
    ),
  },
  {
    key: "viber",
    label: "Viber",
    color: "#7360F2",
    href: (url) => `viber://forward?text=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M11.4 0C9.5.03 5.4.34 3.1 2.45 1.4 4.13 .8 6.6.73 9.66.66 12.7.58 18.44 6.1 20h.01l-.01 2.37s-.03.96.6 1.15c.75.24 1.2-.48 1.93-1.27.4-.44.95-1.08 1.37-1.57 3.77.32 6.67-.4 7-.51.76-.25 5.09-.8 5.79-6.55.73-5.93-.35-9.68-2.3-11.37l-.01-.01c-.59-.54-2.95-2.26-8.22-2.28 0 0-.62-.04-1.5-.03zm.13 1.82c.75-.01 1.28.03 1.28.03 4.46.02 6.6 1.36 7.1 1.81 1.65 1.41 2.49 4.79 1.88 9.74-.58 4.8-4.09 5.1-4.73 5.31-.28.09-2.82.72-6.02.51 0 0-2.38 2.87-3.12 3.62-.12.12-.25.16-.34.14-.13-.03-.17-.18-.16-.4l.02-3.93c-4.67-1.3-4.4-6.19-4.34-8.72.06-2.54.55-4.62 1.98-6.03 1.95-1.76 5.43-2.01 7.04-2.01.24 0 .5-.01.68 0zm.5 2.98a.34.34 0 0 0-.34.33.34.34 0 0 0 .33.35c1.32.03 2.4.47 3.24 1.35.85.88 1.28 2.03 1.28 3.44a.34.34 0 0 0 .34.34.34.34 0 0 0 .34-.34c0-1.56-.5-2.9-1.47-3.9-.98-1.02-2.25-1.53-3.72-1.57zm-3.63.5a.65.65 0 0 0-.45.06l-.02.01c-.36.2-.68.47-.94.75-.2.22-.31.44-.34.65a.9.9 0 0 0 .01.36l.01.02c.1.4.4 1.06.98 2.1.37.68.82 1.36 1.34 1.98a13 13 0 0 0 1.74 1.75l.02.01.02.02.02.01c.62.53 1.3.98 1.98 1.35 1.04.58 1.7.87 2.1.97l.02.01a.9.9 0 0 0 .36.01c.21-.03.43-.14.65-.34.28-.26.55-.58.75-.94l.01-.02a.65.65 0 0 0-.14-.82c-.5-.44-1.03-.83-1.58-1.18a.7.7 0 0 0-.9.16l-.35.44c-.18.22-.5.19-.5.19l-.01.01c-2.36-.6-2.99-3-2.99-3l.01-.01s-.03-.32.2-.5l.43-.35a.7.7 0 0 0 .16-.9 12 12 0 0 0-1.18-1.58.65.65 0 0 0-.37-.2zm4.15.83a.28.28 0 0 0-.03.56c.87.1 1.5.4 1.94.86.44.47.68 1.06.7 1.83a.28.28 0 0 0 .28.27.28.28 0 0 0 .28-.29c-.02-.9-.32-1.66-.87-2.24-.56-.6-1.34-.94-2.28-1.04a.28.28 0 0 0-.03 0zm.13 1.4a.28.28 0 0 0-.07.56c.68.13.98.48 1.08 1.15a.28.28 0 0 0 .32.24.28.28 0 0 0 .23-.32c-.13-.87-.62-1.42-1.52-1.6a.28.28 0 0 0-.04-.02z" />
      </svg>
    ),
  },
];

export function ShareBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [shareUrl, setShareUrl] = useState("");
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShareUrl(window.location.origin + window.location.pathname);
    setShareText(document.title || SITE_URL);
  }, [pathname]);

  const url = shareUrl || SITE_URL + pathname;

  const openShare = (href: string, key: string) => {
    if (key === "viber") {
      window.location.href = href;
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  return (
    <>
      {/* Desktop: sticky vertical bar flush to the left edge */}
      <div className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-r-lg shadow-md lg:flex">
        {SHARE_TARGETS.map((target) => (
          <button
            key={target.key}
            type="button"
            onClick={() => openShare(target.href(url, shareText), target.key)}
            aria-label={`${SHARE_LABEL[locale]} — ${target.label}`}
            className="flex h-11 w-11 items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: target.color }}
          >
            {target.icon}
          </button>
        ))}
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        {SHARE_TARGETS.map((target) => (
          <button
            key={target.key}
            type="button"
            onClick={() => openShare(target.href(url, shareText), target.key)}
            aria-label={`${SHARE_LABEL[locale]} — ${target.label}`}
            className="flex flex-1 items-center justify-center py-3 text-white"
            style={{ backgroundColor: target.color }}
          >
            {target.icon}
          </button>
        ))}
      </div>
    </>
  );
}
