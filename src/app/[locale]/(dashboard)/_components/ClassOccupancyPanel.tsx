"use client";

import { ArrowRight, CircleAlert, Plus, School, TriangleAlert } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";
import {
  DashboardPanel,
  inlineLinkClass,
  linkButtonClass,
} from "./DashboardPanel";

export type OccupancyRow = {
  id: string;
  classNum: string;
  gradeName: string | null;
  count: number;
  capacity: number;
  ratio: number;
};

export type OccupancyTotals = {
  enrolled: number;
  seats: number;
};

type ClassOccupancyPanelProps = {
  rows: OccupancyRow[];
  totals: OccupancyTotals;
  limit?: number;
};

type OccupancyStatus = "over" | "full" | "almostFull" | null;

function getStatus(row: OccupancyRow): OccupancyStatus {
  if (row.count > row.capacity) return "over";
  if (row.capacity > 0 && row.count === row.capacity) return "full";
  if (row.ratio >= 0.8) return "almostFull";
  return null;
}

export function ClassOccupancyPanel({
  rows,
  totals,
  limit = 8,
}: ClassOccupancyPanelProps) {
  const t = useTranslations("dashboard.occupancy");
  const format = useFormatter();

  const visibleRows = rows.slice(0, limit);
  const hiddenCount = rows.length - visibleRows.length;
  const percent =
    totals.seats > 0 ? Math.round((totals.enrolled / totals.seats) * 100) : 0;
  const seatsLabel = t("totalSeats", {
    used: format.number(totals.enrolled),
    total: format.number(totals.seats),
  });

  const hasRows = rows.length > 0;

  return (
    <DashboardPanel
      id="class-occupancy"
      title={t("title")}
      description={t("description")}
      aside={
        hasRows ? (
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {t("percent", { percent })}
          </p>
        ) : undefined
      }
      summary={
        hasRows ? (
          <div>
            <ProgressBar
              value={totals.enrolled}
              max={totals.seats}
              aria-label={seatsLabel}
            />
            <p className="mt-2 text-xs text-muted-foreground">{seatsLabel}</p>
          </div>
        ) : undefined
      }
      footer={
        hasRows ? (
          <Link
            href="/classes"
            className={cn(
              inlineLinkClass,
              "inline-flex items-center gap-1.5 text-sm text-primary",
            )}
          >
            {hiddenCount > 0
              ? t("moreClasses", { count: hiddenCount })
              : t("showAll")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        ) : undefined
      }
    >
      {hasRows ? (
        <ul className="divide-y divide-border">
          {visibleRows.map((row) => {
            const status = getStatus(row);

            return (
              <li key={row.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <Link
                      href={`/classes/${encodeURIComponent(row.id)}`}
                      className={cn(inlineLinkClass, "shrink-0 text-sm")}
                      aria-label={t("classLabel", { classNum: row.classNum })}
                    >
                      {row.classNum}
                    </Link>
                    <span
                      className={cn(
                        "truncate text-xs text-muted-foreground",
                        !row.gradeName && "italic",
                      )}
                    >
                      {row.gradeName ?? t("unknownGrade")}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {status === "over" && (
                      <Badge variant="danger">
                        <TriangleAlert className="size-3" aria-hidden />
                        {t("overCapacity")}
                      </Badge>
                    )}
                    {status === "full" && (
                      <Badge variant="danger">
                        <CircleAlert className="size-3" aria-hidden />
                        {t("full")}
                      </Badge>
                    )}
                    {status === "almostFull" && (
                      <Badge variant="warning">
                        {t("almostFull")}
                      </Badge>
                    )}
                    <span className="text-sm tabular-nums text-foreground">
                      {t("count", {
                        count: format.number(row.count),
                        capacity: format.number(row.capacity),
                      })}
                    </span>
                  </div>
                </div>
                <ProgressBar
                  className="mt-2"
                  value={row.count}
                  max={row.capacity}
                  aria-label={t("ariaLabel", {
                    classNum: row.classNum,
                    count: row.count,
                    capacity: row.capacity,
                  })}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          className="py-8"
          icon={<School aria-hidden />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Link
              href="/classes?create=1"
              className={linkButtonClass("default")}
            >
              <Plus aria-hidden />
              {t("addClass")}
            </Link>
          }
        />
      )}
    </DashboardPanel>
  );
}
