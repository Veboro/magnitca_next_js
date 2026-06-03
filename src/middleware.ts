import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLocaleFromPathname } from "@/lib/locale";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  requestHeaders.set("x-site-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
