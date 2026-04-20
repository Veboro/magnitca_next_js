import { NextResponse, type NextRequest } from "next/server";

function detectLocale(pathname: string) {
  if (pathname === "/ru" || pathname.startsWith("/ru/")) {
    return "ru";
  }

  if (pathname === "/pl" || pathname.startsWith("/pl/")) {
    return "pl";
  }

  return "uk";
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", detectLocale(request.nextUrl.pathname));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|rss.xml|sw.js).*)"],
};
