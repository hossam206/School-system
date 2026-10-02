import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { routing } from "./routing";
import en from "@/src/locales/en.json";

function isMessages(value: unknown): value is AbstractIntlMessages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// English is the base: keys missing from a locale fall back to the English text.
function mergeMessages(
  base: AbstractIntlMessages,
  override: AbstractIntlMessages,
): AbstractIntlMessages {
  const result: AbstractIntlMessages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] =
      isMessages(current) && isMessages(value)
        ? mergeMessages(current, value)
        : value;
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = en as AbstractIntlMessages;
  if (locale === "en") {
    return { locale, messages: base };
  }

  const localeMessages = (await import(`@/src/locales/${locale}.json`))
    .default as AbstractIntlMessages;

  return {
    locale,
    messages: mergeMessages(base, localeMessages),
  };
});
