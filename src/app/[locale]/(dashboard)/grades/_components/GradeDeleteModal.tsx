"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { useSchoolData } from "@/src/hooks/useSchool";
import { schoolStore } from "@/src/store/schoolStore";
import type { Grade } from "@/src/types/school";

const MAX_LISTED = 5;

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

type GradeDeleteModalProps = {
  grade: Grade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (grade: Grade) => void;
};

export function GradeDeleteModal({
  grade,
  open,
  onOpenChange,
  onDeleted,
}: GradeDeleteModalProps) {
  const t = useTranslations("grades");
  const subjects = useSchoolData("subjects");
  const classes = useSchoolData("classes");
  const gradeId = grade?._id;

  const subjectNames = useMemo(
    () =>
      subjects
        .filter((subject) => subject.grade === gradeId)
        .map((subject) => subject.name)
        .sort(collator.compare),
    [subjects, gradeId],
  );

  const classNums = useMemo(
    () =>
      classes
        .filter((item) => item.grade === gradeId)
        .map((item) => item.classNum)
        .sort(collator.compare),
    [classes, gradeId],
  );

  const hasDependents = subjectNames.length > 0 || classNums.length > 0;

  const handleConfirm = () => {
    if (!grade) return;
    schoolStore.getState().remove("grades", grade._id);
    toast.success(t("deleted"));
    onOpenChange(false);
    onDeleted?.(grade);
  };

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("deleteTitle")}
      description={t("deleteDescription", { name: grade?.name ?? "" })}
      confirmVariant="destructive"
      confirmText={t("delete")}
      onConfirm={handleConfirm}
    >
      {hasDependents ? (
        <div className="flex flex-col gap-4">
          <div
            role="alert"
            className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p className="font-medium">
              {t("deleteWarning", {
                subjects: subjectNames.length,
                classes: classNums.length,
              })}
            </p>
          </div>
          {subjectNames.length > 0 && (
            <DependentList label={t("subjects")} items={subjectNames} />
          )}
          {classNums.length > 0 && (
            <DependentList label={t("classes")} items={classNums} />
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("deleteSafe")}</p>
      )}
    </ConfirmModal>
  );
}

type DependentListProps = {
  label: string;
  items: string[];
};

function DependentList({ label, items }: DependentListProps) {
  const t = useTranslations("grades");
  const visible = items.slice(0, MAX_LISTED);
  const hidden = items.length - visible.length;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}{" "}
        <span className="tabular-nums">({items.length})</span>
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {visible.map((item, index) => (
          <li key={`${index}-${item}`}>
            <Badge variant="outline">{item}</Badge>
          </li>
        ))}
        {hidden > 0 && (
          <li>
            <Badge variant="secondary">
              {t("moreCount", { count: hidden })}
            </Badge>
          </li>
        )}
      </ul>
    </div>
  );
}

export default GradeDeleteModal;
