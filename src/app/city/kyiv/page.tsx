import type { Metadata } from "next";
import CityKyivPage from "@/legacy-pages/CityKyiv";
import { getRuCitySlug } from "@/data/cities-ru";

export const metadata: Metadata = {
  title: "Магнітні бурі в Києві сьогодні — погода, якість повітря",
  description:
    "Магнітні бурі в Києві сьогодні: Kp індекс, погода, схід і захід сонця, якість повітря. Актуальні дані для Києва в реальному часі.",
  alternates: {
    canonical: "/city/kyiv",
    languages: {
      uk: "/city/kyiv",
      ru: `/ru/city/${getRuCitySlug("kyiv")}`,
      "x-default": "/city/kyiv",
    },
  },
};

export default function KyivPage() {
  return <CityKyivPage locale="uk" />;
}
