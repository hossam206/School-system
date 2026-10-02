"use client";

import { useTranslations } from "next-intl";
import { Badge, type BadgeVariant } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

type OccupancyLevel = "available" | "almostFull" | "full" | "overCapacity";

/** Share of seats taken (1 = full). Classes without seats but with students count as over capacity. */
export function occupancyRatio(count: number, capacity: number): number {
  if (capacity > 0) return count / capacity;
  return count > 0 ? Number.MAX_SAFE_INTEGER : 0;
}

export function occupancyLevel(count: number, capacity: number): OccupancyLevel {
  const ratio = occupancyRatio(count, capacity);
  if (ratio > 1) return "overCapacity";
  if (ratio >= 1) return "full";
  if (ratio >= 0.8) return "almostFull";
  return "available";
}

const levelVariant: Record<OccupancyLevel, BadgeVariant> = {
  available: "success",
  almostFull: "warning",
  full: "danger",
  overCapacity: "danger",
};

export function occupancyVariant(count: number, capacity: number): BadgeVariant {
  return levelVariant[occupancyLevel(count, capacity)];
}

type OccupancyBadgeProps = {
  count: number;
  capacity: number;
  className?: string;
};

export function OccupancyBadge({ count, capacity, className }: OccupancyBadgeProps) {
  const t = useTranslations("classes");

  return (
    <Badge
      variant={occupancyVariant(count, capacity)}
      className={cn("tabular-nums", className)}
      title={t("occupancyLabel", { count, capacity })}
    >
      {t("capacityBadge", { count, capacity })}
    </Badge>
  );
}
