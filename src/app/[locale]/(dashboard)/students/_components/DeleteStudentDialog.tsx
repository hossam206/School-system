"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { useLookups } from "@/src/hooks/useSchool";
import { schoolStore } from "@/src/store/schoolStore";
import type { Student } from "@/src/types/school";
import { fullNameOf } from "./studentUtils";

type DeleteStudentDialogProps = {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (student: Student) => void;
};

export default function DeleteStudentDialog({
  student,
  open,
  onOpenChange,
  onDeleted,
}: DeleteStudentDialogProps) {
  const t = useTranslations("students");
  const { classById } = useLookups();

  const name = student ? fullNameOf(student) : "";
  const classNum = student ? classById.get(student.class)?.classNum : undefined;

  const handleConfirm = () => {
    if (!student) return;
    schoolStore.getState().remove("students", student._id);
    toast.success(t("deleted"));
    onOpenChange(false);
    onDeleted?.(student);
  };

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("deleteTitle")}
      description={
        classNum
          ? t("deleteWarning", { name, classNum })
          : t("deleteDescription", { name })
      }
      confirmVariant="destructive"
      onConfirm={handleConfirm}
    />
  );
}
