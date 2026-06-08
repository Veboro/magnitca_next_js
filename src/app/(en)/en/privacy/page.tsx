import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "en");
}

export default function EnglishPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Privacy policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          This policy explains how Magnitca processes personal data when you visit magnitca.com,
          read our content, use interactive features, take a sensitivity test, answer a daily poll
          or contact us.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Who we are</h2>
          <p>
            Magnitca is an independent public information service about space weather, magnetic
            storms, the Kp index, solar wind, moon phases and related practical forecasts. In this
            policy, "Magnitca", "we", "us" and "the site" refer to the operator of the public
            website available at magnitca.com.
          </p>
          <p>
            For privacy questions or data protection requests, you can contact us at{" "}
            <a href="mailto:info@magnitca.com" className="text-primary underline">
              info@magnitca.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Scope of this policy</h2>
          <p>
            This policy applies to the public pages of Magnitca and to features provided through the
            website. It does not apply to third-party websites, official data providers, social
            networks, Telegram, hosting platforms or other external services that may be linked from
            our pages. Those services process data under their own privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Data we may process</h2>
          <p>Depending on how you use the site, we may process the following categories of data:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>technical data such as IP address, browser type, device type, operating system, language, approximate location, pages requested, timestamps and server logs;</li>
            <li>analytics data about page views, traffic sources, interactions with content and aggregated usage patterns, if analytics tools are active;</li>
            <li>messages and contact details that you voluntarily send to us by email or through a contact form;</li>
            <li>answers to daily magnetic-storm feeling polls, including the answer, date and technical metadata needed to prevent abuse or duplicate counting;</li>
            <li>meteorological sensitivity test results, if you choose to complete a test and submit the result;</li>
            <li>cookie consent choices and interface preferences such as selected language, where those features are enabled;</li>
            <li>security and anti-abuse data needed to protect the site from spam, scraping, malicious traffic or technical attacks.</li>
          </ul>
          <p>
            You can browse public content without creating an account. Please do not send us
            sensitive personal data, medical records, financial information or other information
            that is not necessary for your request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Why we use data</h2>
          <p>We process data for the following purposes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>to provide the website, load pages, show forecasts and keep public features working;</li>
            <li>to respond to messages, support requests, error reports and cooperation inquiries;</li>
            <li>to display aggregated poll results, test statistics and other non-identifying public indicators;</li>
            <li>to measure traffic, understand which pages are useful and improve the structure, speed and usability of the site;</li>
            <li>to maintain security, diagnose errors, prevent abuse and protect the infrastructure;</li>
            <li>to comply with applicable legal obligations and respond to lawful requests, if any.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Legal bases</h2>
          <p>
            Where the GDPR, UK GDPR or similar privacy rules apply, we rely on the following legal
            bases:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>legitimate interests, including operating, securing, improving and maintaining the site;</li>
            <li>consent, for non-essential cookies, optional analytics or similar technologies where consent is required;</li>
            <li>performance of a request, when you contact us and ask us to respond;</li>
            <li>legal obligation, where we must keep or disclose information under applicable law.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Polls, tests and aggregated results</h2>
          <p>
            Magnitca may let visitors answer whether they feel the influence of a magnetic storm on
            a particular day. We store the answer and the date so that we can show daily percentages
            and later build historical charts. Public poll results are shown only in aggregated
            form, such as the percentage of respondents who feel an effect.
          </p>
          <p>
            If you complete a meteorological sensitivity test, we may store the submitted score,
            date and related non-sensitive technical metadata. Test content is informational only.
            It is not a medical diagnosis, screening tool or substitute for a qualified healthcare
            professional.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. External providers and data sources</h2>
          <p>
            We may use third-party providers for hosting, databases, form delivery, infrastructure,
            analytics, translation tools and other technical services. These providers process data
            only as needed to provide their services to us.
          </p>
          <p>
            Space-weather and weather indicators may be based on open public sources such as NOAA
            SWPC, Open-Meteo and national hydrometeorological services. These providers are data
            sources for forecasts and warnings. They are not sent your private contact messages by
            Magnitca.
          </p>
          <p>
            If Google Analytics 4 or a similar analytics service is active, it may process technical
            and usage data such as page views, traffic source, approximate geography, device type,
            browser and interaction events.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. International transfers</h2>
          <p>
            Some technical providers may process data outside your country or outside the European
            Economic Area. Where applicable, such transfers are handled through the safeguards made
            available by those providers, such as contractual commitments, standard contractual
            clauses or other legally recognized transfer mechanisms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Retention</h2>
          <p>
            We keep personal data only for as long as reasonably necessary for the purposes described
            in this policy. Server logs and security data may be kept for a limited period needed to
            maintain reliability and investigate incidents. Contact messages may be kept while we
            respond and for a reasonable period afterwards to preserve communication history.
          </p>
          <p>
            Poll answers and test statistics may be kept longer where they are needed for aggregated
            historical charts, product analytics or research-style trend summaries, provided that
            public output remains aggregated and not intended to identify individual visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Your rights</h2>
          <p>
            Depending on your location and applicable law, you may have the right to request access
            to your personal data, correction, deletion, restriction of processing, objection to
            processing, portability of certain data and withdrawal of consent where processing is
            based on consent.
          </p>
          <p>
            You may also have the right to lodge a complaint with a competent data protection
            authority. To exercise your rights, contact us at{" "}
            <a href="mailto:info@magnitca.com" className="text-primary underline">
              info@magnitca.com
            </a>
            . We may ask for information needed to verify your request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">11. Children</h2>
          <p>
            Magnitca is not directed to children and does not knowingly collect personal data from
            children. If you believe that a child has provided personal data to us, please contact
            us so that we can review and delete it where appropriate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">12. Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect the site and the data
            we process. No online service can be guaranteed to be completely secure, but we work to
            reduce risks and respond to issues when they are discovered.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">13. Changes to this policy</h2>
          <p>
            We may update this policy when the site changes, when new features are added or when
            legal requirements evolve. The current version is published on this page with the date
            of the latest update.
          </p>
        </section>
      </div>
    </main>
  );
}
