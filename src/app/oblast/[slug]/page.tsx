import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OblastPage } from "@/components/next/oblast-page";
import {
  getOblastHeading,
  getOblastPathsByKey,
  getOblastRouteBySlug,
  getOblastTitle,
  OBLAST_ROUTE_MAP,
} from "@/lib/oblast-routes";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return OBLAST_ROUTE_MAP.map((route) => ({ slug: route.slugUk }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getOblastRouteBySlug("uk", slug);

  if (!route) {
    return {};
  }

  const heading = getOblastHeading("uk", route.regionKey);
  const regionTitle = getOblastTitle("uk", route.regionKey);
  const paths = getOblastPathsByKey(route.regionKey);

  if (!heading || !regionTitle || !paths) {
    return {};
  }

  const title = `Магнітні бурі в ${heading} сьогодні`;
  const description = `${regionTitle}: поточний Kp-індекс, прогноз на 3 дні, попередження УкрГМЦ та сторінки міст області з детальними даними.`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: paths.uk,
      languages: {
        uk: absoluteUrl(paths.uk),
        ru: absoluteUrl(paths.ru),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(paths.uk),
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function OblastUkPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getOblastRouteBySlug("uk", slug);

  if (!route) {
    notFound();
  }

  return <OblastPage locale="uk" regionKey={route.regionKey} />;
}
