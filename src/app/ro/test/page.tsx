import type { Metadata } from "next";
import MeteoTestPage from "@/legacy-pages/MeteoTest";

export const metadata: Metadata = {
  title: "Test de meteosensibilitate — Magnitca Moldova",
  description:
    "Test gratuit de meteosensibilitate: află cât de sensibil poate fi organismul tău la furtuni magnetice și activitate geomagnetică.",
};

export default function RomanianTestPage() {
  return <MeteoTestPage locale="ro" />;
}
