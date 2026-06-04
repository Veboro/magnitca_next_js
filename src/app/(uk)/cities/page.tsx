import { CityCatalogPage } from "@/components/next/city-catalog-page";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return resolveLocalizedMetadata("cities", "/cities", "uk");
}

export default function CitiesPage() {
  return <CityCatalogPage locale="uk" />;
}
