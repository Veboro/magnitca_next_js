import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";

export const metadata: Metadata = {
  title: "FAQ despre furtuni magnetice — Magnitca Moldova",
  description: "Întrebări frecvente despre furtuni magnetice, indicele Kp, vântul solar și influența asupra organismului.",
  alternates: {
    canonical: "/ro/faq",
    languages: {
      ro: "/ro/faq",
    },
  },
};

export default function RomanianFAQPage() {
  return <FAQClient locale="ro" />;
}
