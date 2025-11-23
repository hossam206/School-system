import { NextResponse } from "next/server";

export function setLangCookie(response: NextResponse, locale: string) {
  if (locale !== "en" && locale !== "ar") return response;

  response.cookies.set("lang", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}
