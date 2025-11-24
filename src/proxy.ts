import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  redirectToDefaultLocale,
  setLangCookie,
} from "./lib/middlewareFunctions";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Get locale from request url
  const locale = request.nextUrl.pathname.split("/")[1];

  // 1️⃣ Handle redirect if URL missing locale
  const redirect = redirectToDefaultLocale(request, routing.defaultLocale);
  if (redirect) return redirect;

  // 2️⃣ Normal Next-Intl middleware
  let response = intlMiddleware(request);

  // 3️⃣ Set cookie for current locale
  response = setLangCookie(response, locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
