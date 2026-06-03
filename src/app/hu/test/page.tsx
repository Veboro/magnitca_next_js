import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Meteoérzékenységi teszt — érzékenység mágneses viharokra | Magnitca",
  description:
    "Ingyenes meteoérzékenységi teszt: tudd meg, mennyire reagálhat a szervezeted mágneses viharokra és geomágneses aktivitásra.",
  alternates: {
    canonical: "/hu/test",
    languages: {
      uk: "/test",
      ru: "/ru/test",
      pl: "/pl/test",
      ro: "/ro/test",
      hu: "/hu/test",
      "x-default": "/test",
    },
  },
};

export default function HungarianTestPage() {
  return <MeteoTestPage locale="hu" />;
}
