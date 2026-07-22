import type { NextConfig } from "next";
import path from "path";

const OBLAST_REDIRECTS = [
  ["kyiv", "kiev"],
  ["vinnytska", "vinnitskaya"],
  ["volynska", "volynskaya"],
  ["dnipropetrovska", "dnepropetrovskaya"],
  ["donetska", "donetskaya"],
  ["zhytomyrska", "zhitomirskaya"],
  ["zakarpatska", "zakarpatskaya"],
  ["zaporizka", "zaporozhskaya"],
  ["ivano-frankivska", "ivano-frankovskaya"],
  ["kyivska", "kievskaya"],
  ["kirovohradska", "kirovogradskaya"],
  ["luhanska", "luganskaya"],
  ["lvivska", "lvovskaya"],
  ["mykolaivska", "nikolaevskaya"],
  ["odeska", "odesskaya"],
  ["poltavska", "poltavskaya"],
  ["rivnenska", "rovenskaya"],
  ["sumska", "sumskaya"],
  ["ternopilska", "ternopolskaya"],
  ["kharkivska", "kharkovskaya"],
  ["khersonska", "khersonskaya"],
  ["khmelnytska", "khmelnitskaya"],
  ["cherkaska", "cherkasskaya"],
  ["chernivetska", "chernovitskaya"],
  ["chernihivska", "chernigovskaya"],
  ["krym", "krym"],
] as const;

const MOON_MONTH_REDIRECTS = [
  ["cherven", "iyun", "czerwiec", "iunie", "junius", "june"],
  ["lypen", "iyul", "lipiec", "iulie", "julius", "july"],
  ["serpen", "avgust", "sierpien", "august", "augusztus", "august"],
  ["veresen", "sentyabr", "wrzesien", "septembrie", "szeptember", "september"],
  ["zhovten", "oktyabr", "pazdziernik", "octombrie", "oktober", "october"],
  ["lystopad", "noyabr", "listopad", "noiembrie", "november", "november"],
  ["hruden", "dekabr", "grudzien", "decembrie", "december", "december"],
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: false,
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    webpackBuildWorker: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_APP_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_APP_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // News images live in our own Supabase Storage bucket. The AI pipeline
    // uploads server-generated SVGs (never user uploads), so allowing SVG here
    // is safe when paired with a locked-down CSP and attachment disposition.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    const moonLocaleConfig = [
      { prefix: "", slugIndex: 0 },
      { prefix: "/ru", slugIndex: 1 },
      { prefix: "/pl", slugIndex: 2 },
      { prefix: "/ro", slugIndex: 3 },
      { prefix: "/hu", slugIndex: 4 },
      { prefix: "/en", slugIndex: 5 },
    ] as const;

    const moonRedirects = moonLocaleConfig.flatMap(({ prefix, slugIndex }) =>
      MOON_MONTH_REDIRECTS.flatMap((slugs) =>
        slugs
          .filter((slug) => slug !== slugs[slugIndex])
          .map((slug) => ({
            source: `${prefix}/moon-calendar/${slug}-2026`,
            destination: `${prefix}/moon-calendar/${slugs[slugIndex]}-2026`,
            permanent: true,
          })),
      ),
    );

    const oblastRedirects = OBLAST_REDIRECTS.flatMap(([slugUk, slugRu]) => [
      {
        source: `/oblast/${slugRu}`,
        destination: `/ru/oblast/${slugRu}`,
        permanent: true,
      },
      {
        source: `/ru/oblast/${slugUk}`,
        destination: `/ru/oblast/${slugRu}`,
        permanent: true,
      },
      ...["en", "pl", "hu", "ro"].flatMap((locale) => [
        {
          source: `/${locale}/oblast/${slugUk}`,
          destination: `/oblast/${slugUk}`,
          permanent: true,
        },
        {
          source: `/${locale}/oblast/${slugRu}`,
          destination: `/ru/oblast/${slugRu}`,
          permanent: true,
        },
      ]),
    ]);

    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/pwa-icon-192.png",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/pwa-icon-192.png",
        permanent: false,
      },
      {
        source: "/:locale(en|ru|hu|ro)/wojewodztwo/:slug",
        destination: "/pl/wojewodztwo/:slug",
        permanent: true,
      },
      {
        source: "/wojewodztwo/:slug",
        destination: "/pl/wojewodztwo/:slug",
        permanent: true,
      },
      {
        source: "/:locale(en|ru|pl|hu)/country/:slug",
        destination: "/ro/country/:slug",
        permanent: true,
      },
      {
        source: "/:locale(en|ru|pl|hu)/country/:slug/:path*",
        destination: "/ro/country/:slug/:path*",
        permanent: true,
      },
      {
        source: "/country/:slug",
        destination: "/ro/country/:slug",
        permanent: true,
      },
      {
        source: "/country/:slug/:path*",
        destination: "/ro/country/:slug/:path*",
        permanent: true,
      },
      {
        source: "/pl/judet/:slug",
        destination: "/ro/judet/:slug",
        permanent: true,
      },
      {
        source: "/ru/municipiu/:slug",
        destination: "/ro/municipiu/:slug",
        permanent: true,
      },
      ...oblastRedirects,
      ...moonRedirects,
    ];
  },
};

export default nextConfig;
