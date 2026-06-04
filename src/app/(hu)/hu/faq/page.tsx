import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";

export const metadata: Metadata = {
  title: "Mágneses viharok: GYIK a Kp-indexről, napszélről és hatásokról | Magnitca",
  description: "Gyakori kérdések a mágneses viharokról, Kp-indexről, napszélről és a szervezetre gyakorolt hatásról.",
  alternates: {
    canonical: "/hu/faq",
    languages: {
      hu: "/hu/faq",
    },
  },
};

export default function HungarianFAQPage() {
  return <FAQClient locale="hu" />;
}
