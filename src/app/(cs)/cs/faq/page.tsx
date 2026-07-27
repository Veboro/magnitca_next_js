import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";

export const metadata: Metadata = {
  title: "Magnetické bouře: FAQ o Kp-indexu, slunečním větru a jejich vlivech | Magnitca",
  description: "Často kladené otázky o magnetických bouřích, Kp-indexu, slunečním větru a vlivu na organismus.",
  alternates: {
    canonical: "/cs/faq",
    languages: {
      hu: "/cs/faq",
    },
  },
};

export default function CzechFAQPage() {
  return <FAQClient locale="cs" />;
}
