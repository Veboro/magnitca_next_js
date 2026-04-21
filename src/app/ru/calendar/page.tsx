import type { Metadata } from "next";
import StormCalendarClient from "@/legacy-pages/StormCalendar";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getStormCalendarData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("calendar", "/calendar", "ru");
}

export default async function RussianCalendarPage() {
  const initialData = await getStormCalendarData();
  return <StormCalendarClient locale="ru" initialData={initialData} />;
}
