import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Meteoérzékenységi teszt — érzékenység mágneses viharokra | Magnitca",
  description:
    "Ingyenes meteoérzékenységi teszt: tudd meg, mennyire reagálhat a szervezeted mágneses viharokra és geomágneses aktivitásra.",
};

export default function HungarianTestPage() {
  return <MeteoTestPage locale="hu" />;
}
