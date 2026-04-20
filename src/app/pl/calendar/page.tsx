import type { Metadata } from "next";
import StormCalendarClient from "@/legacy-pages/StormCalendar";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("calendar", "/calendar", "pl");
}

export default function PolishStormCalendarPage() {
  return <StormCalendarClient locale="pl" />;
}
