"use client";

import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import TextInput from "@/src/components/ui/TextInput";
import { useSchoolData } from "@/src/hooks/useSchool";
import { gradeSchema, isTaken } from "@/src/lib/validation/school";
import { schoolStore } from "@/src/store/schoolStore";
import type { Grade, GradeInput } from "@/src/types/school";

const FORM_ID = "grade-form";

type GradeFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The grade to edit; create mode when null. */
  grade?: Grade | null;
};

export function GradeFormModal({
  open,
  onOpenChange,
  grade = null,
}: GradeFormModalProps) {
  const t = useTranslations("grades");
  const tc = useTranslations("common");
  const isEdit = grade !== null;

  // A new session every time the modal opens, so the form always starts fresh.
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSession((value) => value + 1);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("editTitle") : t("createTitle")}
      description={isEdit ? t("editDescription") : t("createDescription")}
      maxWidth="sm:max-w-md"
      footer={
        <>
          <Button variant="btn-cancel" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} variant="btn-primary">
            {isEdit ? tc("saveChanges") : tc("create")}
          </Button>
        </>
      }
    >
      <GradeForm
        key={`${grade?._id ?? "new"}-${session}`}
        grade={grade}
        onDone={() => onOpenChange(false)}
      />
    </Modal>
  );
}

type GradeFormProps = {
  grade: Grade | null;
  onDone: () => void;
};

function GradeForm({ grade, onDone }: GradeFormProps) {
  const t = useTranslations("grades");
  const tc = useTranslations("common");
  const grades = useSchoolData("grades");

  const schema = useMemo(() => {
    const takenNames = grades
      .filter((item) => item._id !== grade?._id)
      .map((item) => item.name);
    const message = tc("alreadyExists");

    return gradeSchema.test("unique-name", message, (values, context) =>
      isTaken(takenNames, values?.name, grade?.name)
        ? context.createError({ path: "name", message })
        : true,
    );
  }, [grades, grade, tc]);

  const formik = useFormik<GradeInput>({
    initialValues: { name: grade?.name ?? "" },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload: GradeInput = schema.cast(values);

      if (grade) {
        const changes: Partial<GradeInput> = {};
        if (payload.name !== grade.name) changes.name = payload.name;

        if (Object.keys(changes).length === 0) {
          toast.info(tc("noChanges"));
          onDone();
          return;
        }

        schoolStore.getState().update("grades", grade._id, changes);
        toast.success(t("updated"));
        onDone();
        return;
      }

      schoolStore.getState().add("grades", payload);
      toast.success(t("created"));
      onDone();
    },
  });

  return (
    <form
      id={FORM_ID}
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4"
    >
      <TextInput
        name="name"
        label={t("name")}
        placeholder={t("namePlaceholder")}
        autocomplete="off"
        mandatory
        maxLength={100}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.name}
        touched={formik.touched.name}
      />
    </form>
  );
}

export default GradeFormModal;
