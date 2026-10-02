"use client";

import { useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

// Formats ISO dates as medium dates in the active locale ("N/A" when invalid).
export function useDateFormatter() {
  const locale = useLocale();
  const tc = useTranslations("common");
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  return useCallback(
    (value: string | undefined) => {
      const time = value ? Date.parse(value) : Number.NaN;
      return Number.isNaN(time) ? tc("notAvailable") : formatter.format(time);
    },
    [formatter, tc],
  );
}
