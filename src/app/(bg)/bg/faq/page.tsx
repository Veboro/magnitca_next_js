import type { Metadata } from "next";
import FAQClient from "@/legacy-pages/FAQ";

export const metadata: Metadata = {
  title: "Магнитни бури: ЧЗВ за Kp-индекса, слънчевия вятър и въздействията | Magnitca",
  description: "Често задавани въпроси за магнитните бури, Kp-индекса, слънчевия вятър и въздействието върху организма.",
  alternates: {
    canonical: "/bg/faq",
    languages: {
      hu: "/bg/faq",
    },
  },
};

export default function BulgarianFAQPage() {
  return <FAQClient locale="bg" />;
}
