"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ArrowRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import * as Yup from "yup";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Modal } from "@/src/components/ui/Modal";
import { Select } from "@/src/components/ui/select";
import TextInput from "@/src/components/ui/TextInput";
import { useSchoolData } from "@/src/hooks/useSchool";
import { Link } from "@/src/i18n/navigation";
import { isTaken, subjectSchema } from "@/src/lib/validation/school";
import { schoolStore } from "@/src/store/schoolStore";
import type { Subject, SubjectInput } from "@/src/types/school";

const FORM_ID = "subject-form";

type SubjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The subject being edited, or `null` to create a new one. */
  subject: Subject | null;
  /** Grade picked in advance when creating (e.g. the active grade filter). */
  defaultGrade?: string;
  /** Changes every time the modal opens, so the form starts fresh. */
  session: number;
};

export function SubjectFormModal({
  open,
  onOpenChange,
  subject,
  defaultGrade,
  session,
}: SubjectFormModalProps) {
  const t = useTranslations("subjects");
  const tc = useTranslations("common");
  const grades = useSchoolData("grades");
  const isEdit = subject !== null;
  // Subjects belong to a grade: without grades, creating shows a hint instead of the form.
  const showForm = isEdit || grades.length > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("editTitle") : t("createTitle")}
      description={isEdit ? t("editDescription") : t("createDescription")}
      footer={
        <>
          <Button variant="btn-cancel" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={!showForm}>
            {tc("save")}
          </Button>
        </>
      }
    >
      {showForm ? (
        <SubjectForm
          key={`${subject?._id ?? "new"}-${session}`}
          subject={subject}
          defaultGrade={defaultGrade}
          onDone={() => onOpenChange(false)}
        />
      ) : (
        <EmptyState
          className="rounded-lg border border-dashed border-border px-4 py-8"
          icon={<GraduationCap />}
          title={t("noGradesHint")}
          description={t("noGradesDescription")}
          action={
            <Link
              href="/grades"
              onClick={() => onOpenChange(false)}
              className={getButtonStyles(undefined, "btn-primary")}
            >
              {t("goToGrades")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          }
        />
      )}
    </Modal>
  );
}

type SubjectFormValues = { name: string; grade: string };

type SubjectFormProps = {
  subject: Subject | null;
  defaultGrade?: string;
  onDone: () => void;
};

function SubjectForm({ subject, defaultGrade, onDone }: SubjectFormProps) {
  const t = useTranslations("subjects");
  const tc = useTranslations("common");
  const grades = useSchoolData("grades");
  const subjects = useSchoolData("subjects");

  const schema = useMemo(() => {
    const nameTaken = t.has("nameTaken")
      ? t("nameTaken")
      : tc("alreadyExists");
    return (
      subjectSchema
        .shape({
          grade: Yup.string().trim().required(t("gradePlaceholder")),
        })
        // A grade can't have two subjects with the same name.
        .test("unique-name-in-grade", nameTaken, function (values) {
          if (!values?.grade) return true;
          const taken = subjects
            .filter(
              (item) =>
                item.grade === values.grade && item._id !== subject?._id,
            )
            .map((item) => item.name);
          if (!isTaken(taken, values.name)) return true;
          return this.createError({ path: "name", message: nameTaken });
        })
    );
  }, [subjects, subject, t, tc]);

  const initialGrade =
    subject?.grade ??
    (defaultGrade && grades.some((grade) => grade._id === defaultGrade)
      ? defaultGrade
      : grades.length === 1
        ? grades[0]._id
        : "");

  const formik = useFormik<SubjectFormValues>({
    initialValues: { name: subject?.name ?? "", grade: initialGrade },
    validationSchema: schema,
    onSubmit: (values) => {
      const cast = schema.cast(values);
      const payload: SubjectInput = { name: cast.name, grade: cast.grade };

      if (!subject) {
        schoolStore.getState().add("subjects", payload);
        toast.success(t("created"));
        onDone();
        return;
      }

      const changes: Partial<SubjectInput> = {};
      if (payload.name !== subject.name) changes.name = payload.name;
      if (payload.grade !== subject.grade) changes.grade = payload.grade;

      if (Object.keys(changes).length === 0) {
        toast.info(tc("noChanges"));
        onDone();
        return;
      }

      schoolStore.getState().update("subjects", subject._id, changes);
      toast.success(t("updated"));
      onDone();
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <form
      id={FORM_ID}
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4"
    >
      <TextInput
        id="subject-name"
        name="name"
        label={t("name")}
        placeholder={t("namePlaceholder")}
        mandatory
        autocomplete="off"
        maxLength={100}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
      />

      <Select
        id="subject-grade"
        name="grade"
        items={grades}
        valueKey="_id"
        labelKey="name"
        label={t("grade")}
        mandatory
        placeholder={t("gradePlaceholder")}
        searchPlaceholder={t("searchGrades")}
        emptyText={t("noGradesFound")}
        unknownLabel={t("unknownGrade")}
        value={values.grade}
        onSelect={(value) => {
          formik.setFieldTouched("grade", true, false);
          formik.setFieldValue("grade", value);
        }}
        onBlur={() => formik.setFieldTouched("grade", true)}
        error={errors.grade}
        touched={touched.grade}
      />
    </form>
  );
}
