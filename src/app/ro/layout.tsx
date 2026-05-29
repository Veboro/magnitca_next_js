import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Magnitca Moldova",
    template: "%s",
  },
};

export default function RomanianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
