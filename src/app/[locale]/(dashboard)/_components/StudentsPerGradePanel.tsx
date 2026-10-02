"use client";

import { GraduationCap, Plus, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";
import {
  DashboardPanel,
  inlineLinkClass,
  linkButtonClass,
} from "./DashboardPanel";

// `id` is null for students whose class or grade no longer exists.
export type GradeBucket = {
  id: string | null;
  name: string | null;
  count: number;
};

type StudentsPerGradePanelProps = {
  buckets: GradeBucket[];
  totalStudents: number;
  hasGrades: boolean;
};

export function StudentsPerGradePanel({
  buckets,
  totalStudents,
  hasGrades,
}: StudentsPerGradePanelProps) {
  const t = useTranslations("dashboard.perGrade");
  const format = useFormatter();

  const maxCount = buckets.reduce(
    (max, bucket) => Math.max(max, bucket.count),
    0,
  );
  const hasStudents = totalStudents > 0;

  return (
    <DashboardPanel
      id="students-per-grade"
      title={t("title")}
      description={t("description")}
      aside={
        hasStudents ? (
          <p className="text-sm font-medium text-muted-foreground">
            {t("count", { count: totalStudents })}
          </p>
        ) : undefined
      }
    >
      {hasStudents ? (
        <ul className="-mx-2 space-y-0.5">
          {buckets.map((bucket) => {
            const name = bucket.name ?? t("unknownGrade");
            const ratio = maxCount > 0 ? bucket.count / maxCount : 0;
            const share = Math.round((bucket.count / totalStudents) * 100);
            const isUnknown = bucket.id === null;

            return (
              <li
                key={bucket.id ?? "unknown"}
                title={`${t("ariaLabel", { grade: name, count: bucket.count })} · ${t("share", { percent: share })}`}
                className="group grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/70 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]"
              >
                {isUnknown ? (
                  <span className="truncate text-sm italic text-muted-foreground">
                    {name}
                  </span>
                ) : (
                  <Link
                    href={`/grades/${encodeURIComponent(bucket.id as string)}`}
                    className={cn(inlineLinkClass, "truncate text-sm")}
                  >
                    {name}
                  </Link>
                )}
                <div className="flex min-w-0 items-center gap-2">
                  {bucket.count > 0 && (
                    <div
                      aria-hidden
                      className={cn(
                        "h-3 shrink-0 rounded-e-[4px] transition-[width,background-color] duration-500 ease-out",
                        isUnknown
                          ? "bg-slate-300 group-hover:bg-slate-400"
                          : "bg-primary group-hover:bg-primary/80",
                      )}
                      style={{
                        width: `max(4px, calc((100% - 3.5rem) * ${ratio}))`,
                      }}
                    />
                  )}
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {format.number(bucket.count)}
                  </span>
                  <span className="sr-only">
                    {t("share", { percent: share })}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : hasGrades ? (
        <EmptyState
          className="py-8"
          icon={<Users aria-hidden />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Link
              href="/students?create=1"
              className={linkButtonClass("default")}
            >
              <Plus aria-hidden />
              {t("addStudent")}
            </Link>
          }
        />
      ) : (
        <EmptyState
          className="py-8"
          icon={<GraduationCap aria-hidden />}
          title={t("noGradesTitle")}
          description={t("noGradesDescription")}
          action={
            <Link
              href="/grades?create=1"
              className={linkButtonClass("default")}
            >
              <Plus aria-hidden />
              {t("addGrade")}
            </Link>
          }
        />
      )}
    </DashboardPanel>
  );
}
