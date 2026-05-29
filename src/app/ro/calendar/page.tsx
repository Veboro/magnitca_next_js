import type { Metadata } from "next";
import StormCalendarClient from "@/legacy-pages/StormCalendar";
import { getStormCalendarData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Calendarul furtunilor magnetice — Magnitca Moldova",
  description: "Calendarul activității geomagnetice și prognoza furtunilor magnetice pentru următoarele zile.",
  alternates: {
    canonical: "/ro/calendar",
    languages: {
      ro: "/ro/calendar",
    },
  },
};

export default async function RomanianStormCalendarPage() {
  const initialData = await getStormCalendarData();
  return <StormCalendarClient locale="ro" initialData={initialData} />;
}
