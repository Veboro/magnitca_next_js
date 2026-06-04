import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Burze magnetyczne dzisiaj — indeks Kp, wiatr słoneczny i prognoza | Magnitca",
    template: "%s",
  },
};

export default function PolishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
