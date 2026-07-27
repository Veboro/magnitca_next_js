import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Magnetické bouře dnes — Kp-index, sluneční vítr a předpověď | Magnitca",
    template: "%s",
  },
};

export default function CzechLayout({ children }: { children: React.ReactNode }) {
  return children;
}
