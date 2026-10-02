"use client";

import { CircleCheck, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";
import { DashboardPanel, linkButtonClass } from "./DashboardPanel";

export type SetupStepKey = "grade" | "subject" | "class" | "teacher" | "student";

export type SetupStep = {
  key: SetupStepKey;
  done: boolean;
  href: string;
};

type SetupChecklistProps = {
  steps: SetupStep[];
};

export function SetupChecklist({ steps }: SetupChecklistProps) {
  const t = useTranslations("dashboard.setup");

  const doneCount = steps.filter((step) => step.done).length;
  const nextKey = steps.find((step) => !step.done)?.key;
  const progressLabel = t("progress", {
    done: doneCount,
    total: steps.length,
  });

  return (
    <DashboardPanel
      id="setup-checklist"
      title={t("title")}
      description={t("description")}
      aside={
        <p className="hidden pt-0.5 text-sm font-medium text-muted-foreground sm:block">
          {progressLabel}
        </p>
      }
      summary={
        <>
          <ProgressBar
            tone="primary"
            value={doneCount}
            max={steps.length}
            aria-label={t("progressLabel")}
          />
          <p className="mt-2 text-xs font-medium text-muted-foreground sm:hidden">
            {progressLabel}
          </p>
        </>
      }
    >
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const isNext = step.key === nextKey;

          return (
            <li
              key={step.key}
              className={cn(
                "flex flex-col rounded-lg border p-4",
                step.done
                  ? "border-border bg-muted/50"
                  : isNext
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card",
              )}
            >
              <div className="flex items-center gap-2">
                {step.done ? (
                  <CircleCheck className="size-5 text-success" aria-hidden />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                      isNext
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                )}
                <span className="text-xs font-medium text-muted-foreground">
                  {step.done ? t("done") : t("todo")}
                </span>
              </div>
              <h3
                className={cn(
                  "mt-3 text-sm font-semibold",
                  step.done ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">
                {t(`steps.${step.key}.description`)}
              </p>
              {!step.done && (
                <Link
                  href={step.href}
                  className={linkButtonClass(
                    isNext ? "default" : "outline",
                    "sm",
                    "mt-4 w-full sm:w-fit",
                  )}
                >
                  <Plus aria-hidden />
                  {t(`steps.${step.key}.action`)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </DashboardPanel>
  );
}
