import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Магнитни бури днес — Kp-индекс, слънчев вятър и прогноза | Magnitca",
    template: "%s",
  },
};

export default function BulgarianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
