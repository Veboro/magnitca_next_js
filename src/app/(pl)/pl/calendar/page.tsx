import type { Metadata } from "next";
import StormCalendarClient from "@/legacy-pages/StormCalendar";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getStormCalendarData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("calendar", "/calendar", "pl");
}

export default async function PolishStormCalendarPage() {
  const initialData = await getStormCalendarData();
  return <StormCalendarClient locale="pl" initialData={initialData} />;
}
