"use client";

import { useTranslations } from "next-intl";
import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "@/src/lib/validation/auth";
import { cn } from "@/src/lib/utils";

type PasswordChecklistProps = {
  password: string;
  // after the field is touched, unmet rules turn red instead of grey
  showErrors: boolean;
};

export function PasswordChecklist({
  password,
  showErrors,
}: PasswordChecklistProps) {
  const t = useTranslations("auth");

  return (
    <ul className="grid gap-1 text-xs sm:grid-cols-2">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const Icon = met ? Check : Circle;

        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2",
              met
                ? "text-success"
                : showErrors
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {t(`passwordRules.${rule.id}`)}
            <span className="sr-only">
              {met ? t("ruleMet") : t("ruleNotMet")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
