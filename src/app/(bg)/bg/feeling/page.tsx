import type { Metadata } from "next";
import SamopochuttyaPage, { buildSamopochuttyaMetadata } from "@/components/dashboard/feeling-page";

export const revalidate = 900;

export const metadata: Metadata = buildSamopochuttyaMetadata("bg");

export default function Page() {
  return <SamopochuttyaPage locale="bg" />;
}
