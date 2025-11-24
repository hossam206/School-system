import { NextResponse } from "next/server";

const VALID_LOCALES = ["en", "ar"];

export function setLangCookie(response: NextResponse, locale: string) {
  if (locale !== "en" && locale !== "ar") return response;

  response.cookies.set("lang", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}

/**
 * Redirects paths missing a locale to the default locale.
 */
export function redirectToDefaultLocale(request: any, defaultLocale = "ar") {
  const pathname = request.nextUrl.pathname;

  // If root or missing locale, redirect
  if (
    pathname === "/" ||
    (!pathname.startsWith("/en") && !pathname.startsWith("/ar"))
  ) {
    const url = new URL(request.url);
    url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);

    return response;
  }
}
