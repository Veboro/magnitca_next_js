import { permanentRedirect } from "next/navigation";
import { getRuCitySlug } from "@/data/cities-ru";

export default function LegacyRussianKyivPage() {
  permanentRedirect(`/ru/city/${getRuCitySlug("kyiv")}`);
}
