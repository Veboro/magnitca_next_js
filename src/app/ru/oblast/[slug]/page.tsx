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
  return OBLAST_ROUTE_MAP.map((route) => ({ slug: route.slugRu }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getOblastRouteBySlug("ru", slug);

  if (!route) {
    return {};
  }

  const heading = getOblastHeading("ru", route.regionKey);
  const regionTitle = getOblastTitle("ru", route.regionKey);
  const paths = getOblastPathsByKey(route.regionKey);

  if (!heading || !regionTitle || !paths) {
    return {};
  }

  const title = `Магнитные бури в ${heading} сегодня`;
  const description = `${regionTitle}: текущий Kp-индекс, прогноз на 3 дня, предупреждения УкрГМЦ и страницы городов области с подробными данными.`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: paths.ru,
      languages: {
        uk: absoluteUrl(paths.uk),
        ru: absoluteUrl(paths.ru),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(paths.ru),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function OblastRuPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getOblastRouteBySlug("ru", slug);

  if (!route) {
    notFound();
  }

  return <OblastPage locale="ru" regionKey={route.regionKey} />;
}
