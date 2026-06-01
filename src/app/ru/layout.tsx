import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Магнитные бури сегодня — Kp-индекс, солнечный ветер и прогноз | Магнитка",
    template: "%s",
  },
};

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
