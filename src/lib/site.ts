export const SITE_URL = "https://magnitca.com";
export const SITE_NAME = "Магнітка";
export const SITE_DESCRIPTION =
  "Моніторинг магнітних бур, Kp-індексу, сонячного вітру та космічної погоди в реальному часі.";

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export type SocialKey = "telegram" | "facebook" | "tiktok" | "youtube" | "instagram";

// Official social profiles — the single source of truth. Used for the footer
// links and the schema.org Organization `sameAs` (the Yoast equivalent that
// Google reads for the knowledge panel / official-profiles signal).
export const SOCIAL_PROFILES: ReadonlyArray<{ key: SocialKey; name: string; url: string }> = [
  { key: "telegram", name: "Telegram", url: "https://t.me/+7UKzAK5ur8UxZmMy" },
  { key: "facebook", name: "Facebook", url: "https://www.facebook.com/profile.php?id=61582497296135" },
  { key: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@magnitca.com" },
  { key: "youtube", name: "YouTube", url: "https://www.youtube.com/@magnitca_com" },
  { key: "instagram", name: "Instagram", url: "https://www.instagram.com/magnitca_com" },
];

export const SOCIAL_PROFILE_URLS = SOCIAL_PROFILES.map((profile) => profile.url);
