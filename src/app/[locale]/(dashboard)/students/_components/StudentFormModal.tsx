"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ArrowRight, Info, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/src/i18n/navigation";
import Button from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import TextInput from "@/src/components/ui/TextInput";
import { MultiSelect, Select } from "@/src/components/ui/select";
import { CopyButton } from "@/src/components/ui/copy-button";
import { FormErrorSummary } from "@/src/components/ui/form-error-summary";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { studentSchema } from "@/src/lib/validation/school";
import { cn } from "@/src/lib/utils";
import { schoolStore } from "@/src/store/schoolStore";
import type { SchoolClass, Student, StudentInput } from "@/src/types/school";
import { collator, diffStudent } from "./studentUtils";

const FORM_ID = "student-form";

type StudentFormValues = {
  firstName: string;
  lastName: string;
  age: number | "";
  class: string;
  subjectsIds: string[];
};

type StudentFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The student being edited; create mode when null. */
  student?: Student | null;
};

function FormHint({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning";
  children: ReactNode;
}) {
  const Icon = tone === "warning" ? TriangleAlert : Info;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm",
        tone === "warning"
          ? "border-warning/30 bg-warning/5 text-foreground"
          : "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "warning" ? "text-warning" : "text-muted-foreground"
        )}
        aria-hidden
      />
      <div className="min-w-0 space-y-1">{children}</div>
    </div>
  );
}

function HintLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
    >
      {children}
      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
    </Link>
  );
}

function errorText(error: unknown): string[] {
  if (typeof error === "string") return [error];
  if (Array.isArray(error)) return error.flatMap(errorText);
  return [];
}

export default function StudentFormModal({
  open,
  onOpenChange,
  student = null,
}: StudentFormModalProps) {
  const t = useTranslations("students");
  const tc = useTranslations("common");
  const classes = useSchoolData("classes");
  const subjects = useSchoolData("subjects");
  const { classById, gradeById, subjectById, studentCountByClass } =
    useLookups();
  const [prunedCount, setPrunedCount] = useState(0);

  const isEdit = student !== null;
  const initialClass = student?.class ?? "";

  const classItems = useMemo(
    () => [...classes].sort((a, b) => collator.compare(a.classNum, b.classNum)),
    [classes]
  );

  // The student's own class stays selectable even when it is full.
  const isClassFull = (item: SchoolClass) =>
    item._id !== initialClass &&
    (studentCountByClass.get(item._id) ?? 0) >= item.capacity;

  const schema = useMemo(
    () =>
      studentSchema
        .test("class-available", "", function (value) {
          const classId = value?.class;
          if (!classId) return true;
          const target = classById.get(classId);
          if (!target) {
            return this.createError({
              path: "class",
              message: t("classMissing"),
            });
          }
          const count = studentCountByClass.get(classId) ?? 0;
          if (classId !== initialClass && count >= target.capacity) {
            return this.createError({
              path: "class",
              message: t("classFullHint"),
            });
          }
          return true;
        })
        .test("subjects-in-grade", "", function (value) {
          const target = value?.class ? classById.get(value.class) : undefined;
          if (!target) return true;
          const ids = value?.subjectsIds ?? [];
          const inGrade = ids.every(
            (id) => subjectById.get(id ?? "")?.grade === target.grade
          );
          return (
            inGrade ||
            this.createError({
              path: "subjectsIds",
              message: t("subjectsMismatch"),
            })
          );
        }),
    [classById, subjectById, studentCountByClass, initialClass, t]
  );

  const formik = useFormik<StudentFormValues>({
    initialValues: {
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      age: student?.age ?? "",
      class: student?.class ?? "",
      subjectsIds: student ? [...(student.subjectsIds ?? [])] : [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload: StudentInput = schema.cast(values);

      if (!student) {
        schoolStore.getState().add("students", payload);
        toast.success(t("created"));
        onOpenChange(false);
        return;
      }

      const changes = diffStudent(student, payload);
      if (Object.keys(changes).length === 0) {
        toast.info(tc("noChanges"));
        onOpenChange(false);
        return;
      }
      schoolStore.getState().update("students", student._id, changes);
      toast.success(t("updated"));
      onOpenChange(false);
    },
  });

  const { values } = formik;
  const selectedClass = values.class ? classById.get(values.class) : undefined;
  const selectedGrade = selectedClass
    ? gradeById.get(selectedClass.grade)
    : undefined;

  const gradeSubjects = useMemo(
    () =>
      selectedClass
        ? subjects
            .filter((subject) => subject.grade === selectedClass.grade)
            .sort((a, b) => collator.compare(a.name, b.name))
        : [],
    [subjects, selectedClass]
  );

  const noClasses = classes.length === 0;
  const noSubjectsForGrade = !!selectedClass && gradeSubjects.length === 0;
  const hasFullClass = classItems.some(isClassFull);
  const saveDisabled = noClasses || noSubjectsForGrade;

  const errorOf = (field: keyof StudentFormValues) =>
    errorText(formik.errors[field])[0];
  const touchedOf = (field: keyof StudentFormValues) =>
    Boolean(formik.touched[field]);

  const summary =
    formik.submitCount > 0
      ? Array.from(new Set(Object.values(formik.errors).flatMap(errorText)))
      : [];

  // Subjects are pruned here only: the new class's grade decides which subjects stay.
  const handleClassChange = (classId: string) => {
    const nextClass = classById.get(classId);
    const kept = values.subjectsIds.filter(
      (id) => !!nextClass && subjectById.get(id)?.grade === nextClass.grade
    );
    setPrunedCount(values.subjectsIds.length - kept.length);
    formik.setFieldTouched("class", true, false);
    formik.setValues({ ...values, class: classId, subjectsIds: kept });
  };

  const classLabel = (item: SchoolClass) => {
    const params = {
      classNum: item.classNum,
      buildingNum: item.buildingNum,
      count: studentCountByClass.get(item._id) ?? 0,
      capacity: item.capacity,
    };
    return isClassFull(item)
      ? t("classOptionLabelFull", params)
      : t("classOptionLabel", params);
  };

  const footer = (
    <>
      <Button variant="btn-cancel" onClick={() => onOpenChange(false)}>
        {tc("cancel")}
      </Button>
      <Button type="submit" form={FORM_ID} disabled={saveDisabled}>
        {isEdit ? tc("saveChanges") : tc("create")}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("editTitle") : t("createTitle")}
      description={isEdit ? t("editDescription") : t("createDescription")}
      footer={footer}
    >
      {noClasses ? (
        <FormHint>
          <p className="font-medium text-foreground">{t("noClassesHint")}</p>
          <p>{t("noClassesDescription")}</p>
          <HintLink href="/classes?create=1">{t("createClass")}</HintLink>
        </FormHint>
      ) : (
        <form
          id={FORM_ID}
          noValidate
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4"
        >
          <FormErrorSummary errors={summary} />

          {student && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">
                {t("studentId")}
              </span>
              <CopyButton value={student.studentId} />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              name="firstName"
              id="student-firstName"
              label={t("firstName")}
              mandatory
              placeholder={t("firstNamePlaceholder")}
              autocomplete="off"
              maxLength={100}
              value={values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf("firstName")}
              touched={touchedOf("firstName")}
            />
            <TextInput
              name="lastName"
              id="student-lastName"
              label={t("lastName")}
              mandatory
              placeholder={t("lastNamePlaceholder")}
              autocomplete="off"
              maxLength={100}
              value={values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf("lastName")}
              touched={touchedOf("lastName")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <TextInput
              name="age"
              id="student-age"
              type="number"
              label={t("age")}
              mandatory
              placeholder={t("agePlaceholder")}
              min={4}
              max={25}
              step={1}
              value={values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf("age")}
              touched={touchedOf("age")}
            />
            <div className="flex min-w-0 flex-col gap-1.5">
              <Select
                id="student-class"
                name="class"
                label={t("class")}
                mandatory
                items={classItems}
                valueKey="_id"
                getLabel={classLabel}
                value={values.class}
                onSelect={handleClassChange}
                onBlur={() => formik.setFieldTouched("class", true)}
                isOptionDisabled={isClassFull}
                placeholder={t("classPlaceholder")}
                searchPlaceholder={t("searchClasses")}
                emptyText={t("noClassesFound")}
                unknownLabel={t("unknownClass")}
                error={errorOf("class")}
                touched={touchedOf("class")}
              />
              {hasFullClass && (
                <p className="text-xs text-muted-foreground">
                  {t("classFullHint")}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <MultiSelect
              id="student-subjects"
              name="subjectsIds"
              label={t("subjects")}
              mandatory
              items={gradeSubjects}
              valueKey="_id"
              labelKey="name"
              value={values.subjectsIds}
              onChange={(ids) => {
                formik.setFieldTouched("subjectsIds", true, false);
                formik.setFieldValue("subjectsIds", ids);
              }}
              onBlur={() => formik.setFieldTouched("subjectsIds", true)}
              disabled={!selectedClass || noSubjectsForGrade}
              placeholder={
                selectedClass
                  ? t("subjectsPlaceholder")
                  : t("subjectsDisabledHint")
              }
              searchPlaceholder={t("searchSubjects")}
              emptyText={t("noSubjectsFound")}
              unknownLabel={t("unknownSubject")}
              error={errorOf("subjectsIds")}
              touched={touchedOf("subjectsIds")}
            />
            {selectedClass && !noSubjectsForGrade && (
              <p className="text-xs text-muted-foreground">
                {t("subjectsForGrade", {
                  grade: selectedGrade?.name ?? t("unknownGrade"),
                })}
              </p>
            )}
            {prunedCount > 0 && (
              <p className="text-xs text-warning">{t("subjectsPruned")}</p>
            )}
          </div>

          {noSubjectsForGrade && (
            <FormHint tone="warning">
              <p>{t("noSubjectsForGrade")}</p>
              <HintLink href="/subjects">{t("noSubjectsHint")}</HintLink>
            </FormHint>
          )}
        </form>
      )}
    </Modal>
  );
}
