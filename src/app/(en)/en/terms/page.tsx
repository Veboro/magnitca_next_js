import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "en");
}

export default function EnglishTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Terms of use</h1>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          These terms govern your access to and use of Magnitca. Please read them together with our
          Privacy policy and Cookie policy.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Acceptance of terms</h2>
          <p>
            By accessing or using Magnitca, you agree to these Terms of use. If you do not agree
            with them, please do not use the site. If you use the site on behalf of an organization,
            you confirm that you have authority to accept these terms for that organization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. What Magnitca provides</h2>
          <p>
            Magnitca provides public information about magnetic storms, geomagnetic activity, the Kp
            index, solar wind, moon phases, local weather-related indicators, warnings and related
            editorial materials. The service may include charts, calendars, daily forecasts,
            articles, Telegram links, tests and visitor polls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Informational nature only</h2>
          <p>
            All content on Magnitca is provided for general information and planning. It is not
            medical, legal, financial, emergency, navigation, aviation, energy-grid or other
            professional advice. Magnetic-storm information can be useful context, but it should not
            be the only basis for health, safety, technical or operational decisions.
          </p>
          <p>
            If you feel unwell, have chronic medical conditions or are concerned about symptoms,
            contact a qualified healthcare professional. If you need official warnings or emergency
            instructions, rely on competent public authorities and official providers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Data sources and forecast accuracy</h2>
          <p>
            We use open external data sources, including space-weather and weather providers such as
            NOAA SWPC, Open-Meteo and national hydrometeorological services. Forecasts, warnings and
            measurements can change quickly and may be delayed, unavailable, incomplete or
            inconsistent between providers.
          </p>
          <p>
            We make reasonable efforts to present information clearly and keep data fresh, but we do
            not guarantee that every value, forecast, translation, chart, warning or article will be
            complete, uninterrupted, error-free or suitable for your specific purpose.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Visitor polls and tests</h2>
          <p>
            Polls and tests on Magnitca are optional. They are designed to help visitors see
            aggregated trends, such as how many people report feeling the influence of a magnetic
            storm on a given day. They do not diagnose sensitivity, disease or any medical
            condition.
          </p>
          <p>
            By submitting a poll answer or test result, you allow us to process it as described in
            the Privacy policy and to show aggregated, non-identifying results on the site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>use the site for unlawful, harmful, fraudulent or abusive purposes;</li>
            <li>attempt to disrupt, overload, scan, reverse engineer or interfere with the site or its infrastructure;</li>
            <li>submit spam, malicious content, false contact details or automated requests that harm service stability;</li>
            <li>copy, scrape or republish site content in a way that violates these terms or applicable law;</li>
            <li>misrepresent Magnitca content as official government, medical or emergency advice.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Intellectual property and permitted use</h2>
          <p>
            The Magnitca name, interface, design, original text, editorial materials, page layouts,
            visual presentation and custom explanatory content are protected by intellectual
            property rights. Open data from third-party providers remains subject to the terms and
            notices of those providers.
          </p>
          <p>
            You may use Magnitca for personal, informational and non-commercial purposes. Short
            excerpts may be quoted with a visible link to the source page. Systematic copying,
            republication, automated extraction or commercial reuse requires prior written
            permission unless applicable law allows otherwise.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. External links and third-party services</h2>
          <p>
            Magnitca may link to third-party websites, public data sources, Telegram, social
            networks, official warning services or other external resources. We do not control those
            services and are not responsible for their content, availability, data practices or
            terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Availability and changes</h2>
          <p>
            We may update, improve, suspend, remove or change any part of the site at any time,
            including pages, features, translations, charts, APIs, forecasts and integrations. We do
            not guarantee continuous or uninterrupted access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Disclaimers and limitation of liability</h2>
          <p>
            Magnitca is provided on an "as is" and "as available" basis. To the maximum extent
            permitted by applicable law, we disclaim warranties of accuracy, fitness for a particular
            purpose, uninterrupted operation and absence of errors.
          </p>
          <p>
            To the maximum extent permitted by applicable law, we are not liable for indirect,
            incidental, consequential or special losses, loss of data, loss of profit, service
            interruptions, decisions made solely on the basis of site content, or errors in external
            data sources.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">11. Consumer and mandatory rights</h2>
          <p>
            Nothing in these terms is intended to limit rights that cannot be excluded under
            applicable consumer protection, data protection or other mandatory laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">12. Changes to these terms</h2>
          <p>
            We may update these terms as the site develops or legal requirements change. The current
            version is published on this page with the date of the latest update. Continued use of
            the site after an update means you accept the updated terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">13. Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
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
