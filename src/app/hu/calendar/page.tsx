import type { Metadata } from "next";
import StormCalendarClient from "@/legacy-pages/StormCalendar";
import { getStormCalendarData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Mágneses vihar naptár — geomágneses aktivitási előrejelzés | Magnitca",
  description: "Geomágneses aktivitási naptár, Kp-előrejelzés és a mágneses viharok várható napjai.",
  alternates: {
    canonical: "/hu/calendar",
    languages: {
      hu: "/hu/calendar",
    },
  },
};

export default async function HungarianStormCalendarPage() {
  const initialData = await getStormCalendarData();
  return <StormCalendarClient locale="hu" initialData={initialData} />;
}
