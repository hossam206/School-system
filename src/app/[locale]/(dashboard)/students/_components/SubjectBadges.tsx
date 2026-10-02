"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import type { Subject } from "@/src/types/school";

type SubjectBadgesProps = {
  subjects: Subject[];
  unknownCount: number;
  /** Badges shown before the rest collapse into "+N" (all when omitted). */
  max?: number;
  className?: string;
};

export default function SubjectBadges({
  subjects,
  unknownCount,
  max,
  className,
}: SubjectBadgesProps) {
  const t = useTranslations("students");

  if (subjects.length === 0 && unknownCount === 0) {
    return (
      <span className="text-sm text-muted-foreground">
        {t("subjectCount", { count: 0 })}
      </span>
    );
  }

  const visible = max === undefined ? subjects : subjects.slice(0, max);
  const hidden = subjects.slice(visible.length);

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visible.map((subject) => (
        <Badge key={subject._id} variant="secondary">
          {subject.name}
        </Badge>
      ))}
      {hidden.length > 0 && (
        <Badge
          variant="outline"
          title={hidden.map((subject) => subject.name).join(", ")}
        >
          {t("moreSubjects", { count: hidden.length })}
        </Badge>
      )}
      {unknownCount > 0 && (
        <Badge variant="danger" title={t("unknownSubject")}>
          {t("unknownSubjects", { count: unknownCount })}
        </Badge>
      )}
    </div>
  );
}
