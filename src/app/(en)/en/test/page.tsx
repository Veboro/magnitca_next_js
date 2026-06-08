import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: {
    absolute: "Weather sensitivity test — sensitivity to magnetic storms | Magnitca",
  },
  description:
    "A free weather sensitivity test. Check how strongly your body may respond to magnetic storms and geomagnetic activity.",
  alternates: {
    canonical: "/en/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      ro: "/ro/test",
      hu: "/hu/test",
      en: "/en/test",
      "x-default": "/test",
    },
  },
};

export default function EnglishTestPage() {
  return <MeteoTestPage locale="en" />;
}
