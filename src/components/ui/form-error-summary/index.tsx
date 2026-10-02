"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";

type FormErrorSummaryProps = {
  title?: string;
  errors: string[];
  className?: string;
};

export function FormErrorSummary({
  title,
  errors,
  className,
}: FormErrorSummaryProps) {
  const t = useTranslations("common");

  if (!errors || errors.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="font-medium">{title ?? t("validationTitle")}</p>
        <ul className="list-disc space-y-0.5 ps-4 text-destructive/90">
          {errors.map((error, index) => (
            <li key={`${index}-${error}`}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export type { FormErrorSummaryProps };
