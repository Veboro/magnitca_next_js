import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: {
    absolute: "Тест за метеочувствителност — чувствителност към магнитни бури | Magnitca",
  },
  description:
    "Безплатен тест за метеочувствителност: разберете колко силно организмът ви може да реагира на магнитни бури и геомагнитна активност.",
  alternates: {
    canonical: "/bg/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      ro: "/ro/test",
      hu: "/bg/test",
      en: "/en/test",
      "x-default": "/test",
    },
  },
};

export default function BulgarianTestPage() {
  return <MeteoTestPage locale="bg" />;
}
