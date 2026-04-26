import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Magnitca",
    template: "%s",
  },
};

export default function PolishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
