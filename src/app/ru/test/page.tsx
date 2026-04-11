import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Тест на метеозависимость — Магнитка",
  description:
    "Бесплатный тест на метеочувствительность. Узнайте, насколько ваш организм чувствителен к магнитным бурям и геомагнитной активности.",
  alternates: {
    canonical: "/ru/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      "x-default": "/test",
    },
  },
};

export default function RussianTestPage() {
  return <MeteoTestPage locale="ru" />;
}
