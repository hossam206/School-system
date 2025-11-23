import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { setLangCookie } from "./lib/middlewareFunctions";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  let response = intlMiddleware(request);

  const locale = request.nextUrl.pathname.split("/")[1]; // 'en' or 'ar'

  response = setLangCookie(response, locale);

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
