import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Магнитка",
    template: "%s",
  },
};

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
