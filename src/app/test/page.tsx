import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Тест на метеозалежність — Магнітка",
  description:
    "Безкоштовний тест на метеочутливість. Дізнайтесь, наскільки ваш організм чутливий до магнітних бур та геомагнітної активності.",
  alternates: {
    canonical: "/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      "x-default": "/test",
    },
  },
};

export default function TestPage() {
  return <MeteoTestPage locale="uk" />;
}
