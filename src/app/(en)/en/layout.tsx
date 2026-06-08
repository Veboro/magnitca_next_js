import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Magnetic storms today — Kp index, solar wind and forecast | Magnitca",
    template: "%s",
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
