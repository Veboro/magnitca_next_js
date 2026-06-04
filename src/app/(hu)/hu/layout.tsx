import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Mágneses viharok ma — Kp-index, napszél és előrejelzés | Magnitca",
    template: "%s",
  },
};

export default function HungarianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
