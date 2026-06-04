import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: {
    absolute: "Тест на метеозалежність — чутливість до магнітних бур | Магнітка",
  },
  description:
    "Безкоштовний тест на метеочутливість. Дізнайтесь, наскільки ваш організм чутливий до магнітних бур та геомагнітної активності.",
  alternates: {
    canonical: "/test",
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

export default function TestPage() {
  return <MeteoTestPage locale="uk" />;
}
