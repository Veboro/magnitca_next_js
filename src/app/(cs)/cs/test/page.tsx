import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: {
    absolute: "Test meteocitlivosti — citlivost na magnetické bouře | Magnitca",
  },
  description:
    "Bezplatný test meteocitlivosti: zjistěte, jak silně může váš organismus reagovat na magnetické bouře a geomagnetickou aktivitu.",
  alternates: {
    canonical: "/cs/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      ro: "/ro/test",
      hu: "/cs/test",
      en: "/en/test",
      "x-default": "/test",
    },
  },
};

export default function CzechTestPage() {
  return <MeteoTestPage locale="cs" />;
}
