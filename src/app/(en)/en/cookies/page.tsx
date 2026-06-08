import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "en");
}

export default function EnglishCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Cookie policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          This policy explains how Magnitca may use cookies and similar technologies when you visit
          magnitca.com.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. What cookies are</h2>
          <p>
            Cookies are small text files stored by your browser when you visit a website. Similar
            technologies may include local storage, pixels, tags or scripts. They can help a website
            remember settings, keep features working, measure traffic or protect the service from
            abuse.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Types of cookies we may use</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Strictly necessary cookies: required for core site functionality, security, routing, language handling, consent storage or technical stability.</li>
            <li>Preference cookies: used to remember choices such as language, interface state or other settings.</li>
            <li>Analytics cookies: used, where enabled, to understand page visits, traffic sources, device types and content engagement.</li>
            <li>Third-party cookies: may be set by external tools, embeds, analytics providers or services linked from our pages.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Why we use cookies</h2>
          <p>We may use cookies and similar technologies to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>make the website load and function correctly;</li>
            <li>remember language or cookie choices;</li>
            <li>measure site performance and understand how visitors use pages;</li>
            <li>detect technical problems, spam, abuse or unusual traffic;</li>
            <li>improve content, navigation, layout and user experience.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Analytics</h2>
          <p>
            If analytics tools such as Google Analytics 4 are active, they may use cookies or
            similar technologies to collect usage statistics. Analytics data may include page views,
            approximate location, browser, device type, traffic source and interaction events. We
            use this information to improve the site and understand which content is useful.
          </p>
          <p>
            Analytics cookies are non-essential. Where consent is legally required, they should only
            be used after consent or under another lawful mechanism permitted by applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Third-party services</h2>
          <p>
            Some pages may include links to Telegram, official data providers, weather services,
            social networks or other external resources. When you open an external service, that
            service may set its own cookies and process data under its own policies. Magnitca does
            not control third-party cookie practices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Managing cookies</h2>
          <p>
            You can manage or delete cookies through your browser settings. Most browsers let you
            block cookies, delete existing cookies or receive a warning before a cookie is stored.
            If Magnitca shows a cookie banner or preference tool, you can use it to accept or reject
            non-essential cookies where available.
          </p>
          <p>
            Blocking strictly necessary cookies may affect core functionality. Blocking analytics or
            preference cookies should not prevent public pages from loading, but some settings may
            not be remembered.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Changes to this policy</h2>
          <p>
            We may update this Cookie policy when our site, analytics setup, integrations or legal
            requirements change. The latest version is always published on this page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Contact</h2>
          <p>
            Cookie-related questions can be sent to{" "}
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
