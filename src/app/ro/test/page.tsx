import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Test de meteosensibilitate — sensibilitate la furtuni magnetice | Magnitca",
  description:
    "Test gratuit de meteosensibilitate: află cât de sensibil poate fi organismul tău la furtuni magnetice și activitate geomagnetică.",
  alternates: {
    canonical: "/ro/test",
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

export default function RomanianTestPage() {
  return <MeteoTestPage locale="ro" />;
}
