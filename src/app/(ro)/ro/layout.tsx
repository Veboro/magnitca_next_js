import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Furtuni magnetice astăzi — indice Kp, vânt solar și prognoză | Magnitca",
    template: "%s",
  },
};

export default function RomanianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
