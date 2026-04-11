export const SITE_URL = "https://magnitca.com";
export const SITE_NAME = "Магнітка";
export const SITE_DESCRIPTION =
  "Моніторинг магнітних бур, Kp-індексу, сонячного вітру та космічної погоди в реальному часі.";

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
