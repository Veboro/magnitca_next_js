import { CityCatalogPage } from "@/components/next/city-catalog-page";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return resolveLocalizedMetadata("cities", "/cities", "ru");
}

export default function RuCitiesPage() {
  return <CityCatalogPage locale="ru" />;
}
