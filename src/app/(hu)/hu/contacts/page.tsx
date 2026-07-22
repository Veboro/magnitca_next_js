import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "hu");
}

export default function HungarianContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Kapcsolat</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Kérdésed van, hibát találtál, vagy együttműködést javasolnál? Írj nekünk erre a címre:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — minden levélre válaszolunk.
        </p>
      </div>
    </main>
  );
}
