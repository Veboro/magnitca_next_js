import type { Metadata } from "next";
import CityKyivPage from "@/legacy-pages/CityKyiv";

export const metadata: Metadata = {
  title: "Магнитные бури в Киеве сегодня — погода, качество воздуха",
  description:
    "Магнитные бури в Киеве сегодня: Kp индекс, погода, восход и закат солнца, качество воздуха. Актуальные данные для Киева в реальном времени.",
  alternates: {
    canonical: "/ru/city/kiev",
    languages: {
      uk: "/city/kyiv",
      ru: "/ru/city/kiev",
      "x-default": "/city/kyiv",
    },
  },
};

export default function RussianKyivPage() {
  return <CityKyivPage locale="ru" />;
}
