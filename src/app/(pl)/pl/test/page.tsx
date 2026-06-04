import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: {
    absolute: "Test na meteowrażliwość — wrażliwość na burze magnetyczne | Magnitca",
  },
  description:
    "Bezpłatny test na meteowrażliwość. Sprawdź, jak silnie Twój organizm reaguje na burze magnetyczne i aktywność geomagnetyczną.",
  alternates: {
    canonical: "/pl/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      ro: "/ro/test",
      hu: "/hu/test",
      "x-default": "/test",
    },
  },
};

export default function PolishTestPage() {
  return <MeteoTestPage locale="pl" />;
}
