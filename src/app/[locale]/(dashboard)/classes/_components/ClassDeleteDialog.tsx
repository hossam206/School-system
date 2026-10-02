"use client";

import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { schoolStore } from "@/src/store/schoolStore";
import type { SchoolClass } from "@/src/types/school";

type ClassDeleteDialogProps = {
  /** Kept by the caller after closing so the text doesn't change during the close animation. */
  classItem: SchoolClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export function ClassDeleteDialog({
  classItem,
  open,
  onOpenChange,
  onDeleted,
}: ClassDeleteDialogProps) {
  const t = useTranslations("classes");
  const { studentCountByClass } = useLookups();
  const teachers = useSchoolData("teachers");

  const classNum = classItem?.classNum.trim() ?? "";
  const studentCount = classItem
    ? (studentCountByClass.get(classItem._id) ?? 0)
    : 0;
  const teacherCount = useMemo(
    () =>
      classNum
        ? teachers.filter((teacher) => teacher.classNum.trim() === classNum)
            .length
        : 0,
    [teachers, classNum],
  );
  const hasDependents = studentCount > 0 || teacherCount > 0;

  const handleConfirm = () => {
    if (!classItem) return;
    schoolStore.getState().remove("classes", classItem._id);
    toast.success(t("deleted"));
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      confirmVariant="destructive"
      title={t("deleteTitle")}
      description={
        classItem ? (
          <div className="space-y-3">
            <p>{t("deleteDescription", { name: classItem.classNum })}</p>
            {hasDependents ? (
              <div className="flex gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p className="font-medium">
                  {t("deleteAssignedWarning", {
                    students: studentCount,
                    teachers: teacherCount,
                  })}
                </p>
              </div>
            ) : (
              <p>{t("deleteSafe")}</p>
            )}
          </div>
        ) : undefined
      }
      onConfirm={handleConfirm}
    />
  );
}
