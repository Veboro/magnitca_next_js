import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Test na meteowrażliwość — Magnitca",
  description:
    "Bezpłatny test na meteowrażliwość. Sprawdź, jak silnie Twój organizm reaguje na burze magnetyczne i aktywność geomagnetyczną.",
  alternates: {
    canonical: "/pl/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      "x-default": "/test",
    },
  },
};

export default function PolishTestPage() {
  return <MeteoTestPage locale="pl" />;
}
