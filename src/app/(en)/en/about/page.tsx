import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "en");
}

export default function EnglishAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">About Magnitca</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Magnitca is an independent space-weather service that turns technical solar and
          geomagnetic data into clear, practical information for everyday readers.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">What this project is</h2>
          <p>
            Magnitca explains magnetic storms, the Kp index, solar wind, geomagnetic forecasts and
            related natural cycles in a way that is easier to understand than raw technical feeds.
            The site is built for people who want quick context, a readable forecast and a calmer
            way to follow space weather.
          </p>
          <p>
            Our goal is not to dramatize magnetic storms. It is to show what is happening, how
            strong the activity is, which indicators matter and what a reasonable person can take
            from the forecast without panic.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">What you can find here</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>current geomagnetic status and Kp-index forecasts;</li>
            <li>solar wind and IMF indicators in a visual format;</li>
            <li>27-day magnetic-storm calendars for general planning;</li>
            <li>moon calendars and explanatory pages;</li>
            <li>news and editorial materials about space weather and related topics;</li>
            <li>optional polls and tests that show aggregated visitor trends.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Data sources</h2>
          <p>
            Space-weather indicators are based on open data from recognized public sources,
            including NOAA Space Weather Prediction Center. Weather and local context may use
            additional open providers such as Open-Meteo or national hydrometeorological services.
          </p>
          <p>
            We transform those feeds into a readable interface, but the official providers remain
            the primary reference in case of discrepancies, delayed updates or emergency-level
            warnings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Editorial principles</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>We separate measurements from interpretation.</li>
            <li>We avoid sensational wording where the data does not support it.</li>
            <li>We treat health-related effects as informational, not diagnostic.</li>
            <li>We update pages and translations as the service grows.</li>
            <li>We prefer practical clarity over technical noise.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Important limitation</h2>
          <p>
            Magnitca is not an official government warning system, medical service or emergency
            advisory platform. Forecasts can be delayed or change quickly. If you need official
            safety instructions, operational data or medical advice, rely on competent authorities
            and qualified professionals.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Use of materials</h2>
          <p>
            Original Magnitca text, page design, charts, editorial selections and explanatory
            materials are protected. You may quote short excerpts with a visible link to the source
            page. Copying, republishing, adaptation or commercial use of substantial parts of the
            site requires prior written permission unless applicable law allows otherwise.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Methodology &amp; scientific limitations</h2>
          <p>
            The “impact on well-being” and “sensitivity level” indicators are heuristic estimates
            derived from public data — the Kp index and geomagnetic activity, and where shown, changes
            in air pressure. They are meant as general orientation, not a medical diagnosis or a
            personalized prediction, and every person reacts differently.
          </p>
          <p>
            The link between geomagnetic activity and human well-being is not firmly established: the
            scientific evidence is limited and mixed. This content is informational and does not
            replace professional medical advice. If you have health concerns, consult a qualified
            doctor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Contact</h2>
          <p>
            The project's founder and editor is{" "}
            <a href="https://www.facebook.com/golovne" target="_blank" rel="author noopener noreferrer" className="text-primary underline">
              Andrew Orobets
            </a>
            . Questions, corrections and cooperation inquiries can be sent to{" "}
            <a href="mailto:info@magnitca.com" className="text-primary underline">
              info@magnitca.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
