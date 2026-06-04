import { redirect } from "next/navigation";
import { getRuCitySlug } from "@/data/cities-ru";

export default function LegacyRussianKyivPage() {
  redirect(`/ru/city/${getRuCitySlug("kyiv")}`);
}
