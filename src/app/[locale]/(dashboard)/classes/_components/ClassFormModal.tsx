"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { Info, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { Select } from "@/src/components/ui/select";
import TextInput from "@/src/components/ui/TextInput";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link } from "@/src/i18n/navigation";
import { isTaken, makeClassSchema } from "@/src/lib/validation/school";
import { schoolStore } from "@/src/store/schoolStore";
import type { Grade, SchoolClass, SchoolClassInput } from "@/src/types/school";

const FORM_ID = "class-form";

const gradeCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

type ClassFormValues = {
  classNum: string;
  floorNum: number | "";
  buildingNum: string;
  capacity: number | "";
  grade: string;
};

type ClassFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The class being edited; `null` creates a new class. */
  classItem: SchoolClass | null;
};

function changedFields<T extends object>(next: T, previous: T): Partial<T> {
  const diff: Partial<T> = {};
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (next[key] !== previous[key]) diff[key] = next[key];
  }
  return diff;
}

export function ClassFormModal({
  open,
  onOpenChange,
  classItem,
}: ClassFormModalProps) {
  const t = useTranslations("classes");
  const tc = useTranslations("common");
  const grades = useSchoolData("grades");
  const noGrades = grades.length === 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={classItem ? t("editTitle") : t("createTitle")}
      description={classItem ? t("editDescription") : t("createDescription")}
      footer={
        <>
          <Button variant="btn-cancel" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={noGrades}>
            {tc("save")}
          </Button>
        </>
      }
    >
      {/* The dialog content unmounts when closed, so the form starts fresh on every open. */}
      <ClassForm
        key={classItem?._id ?? "new"}
        classItem={classItem}
        grades={grades}
        onDone={() => onOpenChange(false)}
      />
    </Modal>
  );
}

type ClassFormProps = {
  classItem: SchoolClass | null;
  grades: Grade[];
  onDone: () => void;
};

function ClassForm({ classItem, grades, onDone }: ClassFormProps) {
  const t = useTranslations("classes");
  const tc = useTranslations("common");
  const { studentCountByClass } = useLookups();
  const classes = useSchoolData("classes");
  const teachers = useSchoolData("teachers");

  const studentCount = classItem
    ? (studentCountByClass.get(classItem._id) ?? 0)
    : 0;
  const currentClassNum = classItem?.classNum;

  const sortedGrades = useMemo(
    () => [...grades].sort((a, b) => gradeCollator.compare(a.name, b.name)),
    [grades],
  );

  const takenClassNums = useMemo(
    () =>
      classes
        .filter((item) => item._id !== classItem?._id)
        .map((item) => item.classNum),
    [classes, classItem?._id],
  );

  const schema = useMemo(
    () =>
      makeClassSchema(studentCount).test(
        "unique-class-num",
        t("classNumTaken"),
        function (value) {
          if (!isTaken(takenClassNums, value?.classNum, currentClassNum)) {
            return true;
          }
          return this.createError({
            path: "classNum",
            message: t("classNumTaken"),
          });
        },
      ),
    [studentCount, takenClassNums, currentClassNum, t],
  );

  const formik = useFormik<ClassFormValues>({
    initialValues: classItem
      ? {
          classNum: classItem.classNum,
          floorNum: classItem.floorNum,
          buildingNum: classItem.buildingNum,
          capacity: classItem.capacity,
          grade: classItem.grade,
        }
      : {
          classNum: "",
          floorNum: "",
          buildingNum: "",
          capacity: "",
          grade: "",
        },
    validationSchema: schema,
    onSubmit: (values) => {
      const cast = schema.cast(values);
      const payload: SchoolClassInput = {
        classNum: cast.classNum,
        floorNum: cast.floorNum,
        buildingNum: cast.buildingNum,
        capacity: cast.capacity,
        grade: cast.grade,
      };

      if (!classItem) {
        schoolStore.getState().add("classes", payload);
        toast.success(t("created"));
        onDone();
        return;
      }

      const diff = changedFields(payload, {
        classNum: classItem.classNum,
        floorNum: classItem.floorNum,
        buildingNum: classItem.buildingNum,
        capacity: classItem.capacity,
        grade: classItem.grade,
      });
      if (Object.keys(diff).length === 0) {
        toast.info(tc("noChanges"));
        onDone();
        return;
      }
      schoolStore.getState().update("classes", classItem._id, diff);
      toast.success(t("updated"));
      onDone();
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  // Teachers are linked by class number, so renaming a class leaves them on the old number.
  const previousClassNum = classItem?.classNum.trim() ?? "";
  const nextClassNum = values.classNum.trim();
  const isRenamed =
    !!classItem && nextClassNum !== "" && nextClassNum !== previousClassNum;
  const linkedTeacherCount = useMemo(
    () =>
      previousClassNum
        ? teachers.filter(
            (teacher) => teacher.classNum.trim() === previousClassNum,
          ).length
        : 0,
    [teachers, previousClassNum],
  );

  const showCapacityError = !!errors.capacity && !!touched.capacity;

  return (
    <form
      id={FORM_ID}
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4"
    >
      {grades.length === 0 && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="font-medium">{t("noGradesHint")}</p>
            <p>{t("noGradesDescription")}</p>
            <Link
              href="/grades?create=1"
              className="inline-flex font-medium text-amber-900 underline underline-offset-2 hover:no-underline"
            >
              {t("createGrade")}
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <TextInput
            name="classNum"
            label={t("classNum")}
            placeholder={t("classNumPlaceholder")}
            mandatory
            autocomplete="off"
            maxLength={20}
            value={values.classNum}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.classNum}
            touched={touched.classNum}
          />
          {isRenamed && linkedTeacherCount > 0 && (
            <p className="flex gap-1.5 text-xs text-amber-700">
              <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
              <span>
                {t("classNumTeachersWarning", {
                  count: linkedTeacherCount,
                  classNum: previousClassNum,
                })}
              </span>
            </p>
          )}
        </div>

        <Select<Grade>
          id="grade"
          name="grade"
          label={t("grade")}
          mandatory
          items={sortedGrades}
          valueKey="_id"
          labelKey="name"
          value={values.grade}
          onSelect={(value) => {
            formik.setFieldTouched("grade", true, false);
            formik.setFieldValue("grade", value);
          }}
          onBlur={() => formik.setFieldTouched("grade", true)}
          disabled={grades.length === 0}
          placeholder={t("gradePlaceholder")}
          searchPlaceholder={t("searchGrades")}
          emptyText={t("noGradesFound")}
          unknownLabel={t("unknownGrade")}
          error={errors.grade}
          touched={touched.grade}
        />

        <TextInput
          name="buildingNum"
          label={t("buildingNum")}
          placeholder={t("buildingNumPlaceholder")}
          mandatory
          autocomplete="off"
          value={values.buildingNum}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.buildingNum}
          touched={touched.buildingNum}
        />

        <TextInput
          name="floorNum"
          type="number"
          label={t("floorNum")}
          placeholder={t("floorNumPlaceholder")}
          mandatory
          min={1}
          step={1}
          value={values.floorNum}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.floorNum}
          touched={touched.floorNum}
        />

        <div className="flex flex-col gap-1.5">
          <TextInput
            name="capacity"
            type="number"
            label={t("capacity")}
            placeholder={t("capacityPlaceholder")}
            mandatory
            min={Math.max(1, studentCount)}
            max={15}
            step={1}
            value={values.capacity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.capacity}
            touched={touched.capacity}
          />
          {!showCapacityError && (
            <p className="text-xs text-muted-foreground">
              {studentCount > 0
                ? t("capacityMinHint", { count: studentCount })
                : t("capacityHint")}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
