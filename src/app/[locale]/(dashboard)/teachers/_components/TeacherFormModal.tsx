"use client";

import { useMemo } from "react";
import { useFormik } from "formik";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import { CopyButton } from "@/src/components/ui/copy-button";
import { Modal } from "@/src/components/ui/Modal";
import { Select } from "@/src/components/ui/select";
import TextInput from "@/src/components/ui/TextInput";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link } from "@/src/i18n/navigation";
import { teacherSchema } from "@/src/lib/validation/school";
import { schoolStore } from "@/src/store/schoolStore";
import type { Teacher, TeacherInput } from "@/src/types/school";

const FORM_ID = "teacher-form";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

type ClassOption = { value: string; label: string };

type TeacherFormValues = {
  firstName: string;
  lastName: string;
  age: number | "";
  classNum: string;
};

type TeacherFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The teacher being edited, or `null` to create a new one. */
  teacher: Teacher | null;
  /** Changes every time the modal opens, so the form starts fresh. */
  session: number;
};

// Only the fields whose value actually changed.
function changedFields<T extends object>(next: T, current: Partial<T>): Partial<T> {
  const diff: Partial<T> = {};
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (next[key] !== current[key]) diff[key] = next[key];
  }
  return diff;
}

export function TeacherFormModal({
  open,
  onOpenChange,
  teacher,
  session,
}: TeacherFormModalProps) {
  const t = useTranslations("teachers");
  const tc = useTranslations("common");
  const classes = useSchoolData("classes");
  const { gradeById } = useLookups();

  const legacyClassNum =
    teacher && !classes.some((item) => item.classNum === teacher.classNum)
      ? teacher.classNum
      : null;

  const classOptions = useMemo<ClassOption[]>(() => {
    const seen = new Set<string>();
    const options: ClassOption[] = [];
    const sorted = [...classes].sort((a, b) =>
      collator.compare(a.classNum, b.classNum),
    );
    for (const item of sorted) {
      if (!item.classNum || seen.has(item.classNum)) continue;
      seen.add(item.classNum);
      options.push({
        value: item.classNum,
        label: t("classOptionGrade", {
          classNum: item.classNum,
          grade: gradeById.get(item.grade)?.name ?? t("unknownGrade"),
        }),
      });
    }
    if (legacyClassNum) {
      options.unshift({
        value: legacyClassNum,
        label: t("notKnownClassOption", { classNum: legacyClassNum }),
      });
    }
    return options;
  }, [classes, gradeById, legacyClassNum, t]);

  const hasClasses = classes.length > 0;
  // Creating needs an existing class; editing a teacher with a legacy value stays possible.
  const saveBlocked = !teacher && !hasClasses;
  const close = () => onOpenChange(false);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={teacher ? t("editTitle") : t("createTitle")}
      description={teacher ? t("editDescription") : t("createDescription")}
      footer={
        <>
          <Button variant="btn-cancel" onClick={close}>
            {tc("cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={saveBlocked}>
            {teacher ? tc("saveChanges") : t("add")}
          </Button>
        </>
      }
    >
      <TeacherForm
        key={`${teacher?._id ?? "new"}-${session}`}
        teacher={teacher}
        classOptions={classOptions}
        hasClasses={hasClasses}
        legacyClassNum={legacyClassNum}
        saveBlocked={saveBlocked}
        onDone={close}
      />
    </Modal>
  );
}

type TeacherFormProps = {
  teacher: Teacher | null;
  classOptions: ClassOption[];
  hasClasses: boolean;
  legacyClassNum: string | null;
  saveBlocked: boolean;
  onDone: () => void;
};

function TeacherForm({
  teacher,
  classOptions,
  hasClasses,
  legacyClassNum,
  saveBlocked,
  onDone,
}: TeacherFormProps) {
  const t = useTranslations("teachers");
  const tc = useTranslations("common");

  const formik = useFormik<TeacherFormValues>({
    initialValues: {
      firstName: teacher?.firstName ?? "",
      lastName: teacher?.lastName ?? "",
      age: teacher?.age ?? "",
      classNum: teacher?.classNum ?? "",
    },
    validationSchema: teacherSchema,
    onSubmit: (values) => {
      if (saveBlocked) return;
      const payload: TeacherInput = teacherSchema.cast(values, {
        stripUnknown: true,
      });

      if (!teacher) {
        schoolStore.getState().add("teachers", payload);
        toast.success(t("created"));
        onDone();
        return;
      }

      const diff = changedFields(payload, teacher);
      if (Object.keys(diff).length === 0) {
        toast.info(tc("noChanges"));
        onDone();
        return;
      }
      schoolStore.getState().update("teachers", teacher._id, diff);
      toast.success(t("updated"));
      onDone();
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldTouched, setFieldValue } =
    formik;

  return (
    <form
      id={FORM_ID}
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4"
    >
      {teacher && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          <span className="text-muted-foreground">{t("teacherId")}</span>
          <CopyButton value={teacher.teacherId} />
        </div>
      )}

      {!hasClasses && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="font-medium">{t("noClassesHint")}</p>
            <p>{t("noClassesDescription")}</p>
            <Link
              href="/classes?create=1"
              className="inline-flex font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("createClass")}
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          id="teacher-firstName"
          name="firstName"
          label={t("firstName")}
          placeholder={t("firstNamePlaceholder")}
          autocomplete="off"
          mandatory
          maxLength={100}
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          touched={touched.firstName}
        />
        <TextInput
          id="teacher-lastName"
          name="lastName"
          label={t("lastName")}
          placeholder={t("lastNamePlaceholder")}
          autocomplete="off"
          mandatory
          maxLength={100}
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          touched={touched.lastName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          id="teacher-age"
          name="age"
          type="number"
          label={t("age")}
          placeholder={t("agePlaceholder")}
          mandatory
          min={21}
          max={70}
          step={1}
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.age}
          touched={touched.age}
        />
        <Select
          id="teacher-classNum"
          name="classNum"
          label={t("classNum")}
          mandatory
          items={classOptions}
          valueKey="value"
          labelKey="label"
          value={values.classNum}
          onSelect={(value) => {
            setFieldTouched("classNum", true, false);
            setFieldValue("classNum", value);
          }}
          onBlur={() => setFieldTouched("classNum", true)}
          disabled={classOptions.length === 0}
          placeholder={t("classNumPlaceholder")}
          searchPlaceholder={t("searchClasses")}
          emptyText={t("noClassesFound")}
          unknownLabel={t("unknownClass")}
          error={errors.classNum}
          touched={touched.classNum}
        />
      </div>

      {legacyClassNum && values.classNum === legacyClassNum ? (
        <p className="text-xs text-amber-700">
          {t("legacyClassHint", { classNum: legacyClassNum })}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("classNumHint")}</p>
      )}
    </form>
  );
}
