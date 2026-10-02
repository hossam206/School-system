"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  CalendarDays,
  IdCard,
  Pencil,
  School,
  Trash2,
  User,
  UserX,
} from "lucide-react";
import { Link, useRouter } from "@/src/i18n/navigation";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import { Badge } from "@/src/components/ui/badge";
import { CopyButton } from "@/src/components/ui/copy-button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { cn } from "@/src/lib/utils";
import type { Student } from "@/src/types/school";
import DeleteStudentDialog from "./DeleteStudentDialog";
import StudentFormModal from "./StudentFormModal";
import { classHref, toStudentRow } from "./studentUtils";

function decodeId(raw: string | undefined) {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function DetailCard({
  title,
  description,
  icon,
  action,
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-4">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default function StudentDetailView() {
  const t = useTranslations("students");
  const td = useTranslations("students.detail");
  const tc = useTranslations("common");
  const tClasses = useTranslations("classes");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeId(params?.id);

  const students = useSchoolData("students");
  const lookups = useLookups();

  // Keeps the page steady while navigating away after a delete.
  const [removed, setRemoved] = useState<Student | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const found = students.find((student) => student._id === id) ?? null;
  const current = found ?? removed;

  const row = useMemo(
    () => (current ? toStudentRow(current, lookups) : null),
    [current, lookups]
  );

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale]
  );
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
  };

  if (!row || !current) {
    return (
      <div>
        <PageHeader
          title={td("pageTitle")}
          backHref="/students"
          backLabel={td("back")}
        />
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <EmptyState
            icon={<UserX />}
            title={td("notFoundTitle")}
            description={td("notFoundDescription")}
            action={
              <Link
                href="/students"
                className={getButtonStyles(undefined, "outline")}
              >
                {td("backToList")}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const isRemoved = !found;
  const { schoolClass, grade } = row;
  const classCount = schoolClass
    ? (lookups.studentCountByClass.get(schoolClass._id) ?? 0)
    : 0;
  const subjectTotal = row.subjects.length + row.unknownSubjectCount;

  return (
    <div>
      <PageHeader
        title={row.fullName}
        description={td("description")}
        backHref="/students"
        backLabel={td("back")}
        actions={
          <>
            <Button
              variant="outline"
              prefix={<Pencil aria-hidden />}
              disabled={isRemoved}
              onClick={() => {
                setFormKey((key) => key + 1);
                setFormOpen(true);
              }}
            >
              {tc("edit")}
            </Button>
            <Button
              variant="destructive"
              prefix={<Trash2 aria-hidden />}
              disabled={isRemoved}
              onClick={() => setDeleteOpen(true)}
            >
              {tc("delete")}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <DetailCard title={td("studentId")} icon={<IdCard />}>
          <CopyButton value={row.studentId} className="[&>span]:text-sm" />
        </DetailCard>

        <DetailCard title={td("age")} icon={<User />}>
          <p className="text-2xl font-semibold text-foreground tabular-nums">
            {row.age}
          </p>
        </DetailCard>

        <DetailCard
          title={td("classTitle")}
          icon={<School />}
          action={
            schoolClass ? (
              <Link
                href={classHref(schoolClass._id)}
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                {td("viewClass")}
              </Link>
            ) : undefined
          }
        >
          {schoolClass ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <Link
                  href={classHref(schoolClass._id)}
                  className="text-2xl font-semibold text-foreground hover:text-primary hover:underline underline-offset-4"
                >
                  {schoolClass.classNum}
                </Link>
                {grade ? (
                  <span className="text-sm text-muted-foreground">
                    {grade.name}
                  </span>
                ) : (
                  <Badge variant="warning">{t("unknownGrade")}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {tClasses("location", {
                  building: schoolClass.buildingNum,
                  floor: schoolClass.floorNum,
                })}
              </p>
              <ProgressBar
                value={classCount}
                max={schoolClass.capacity}
                aria-label={tClasses("occupancyLabel", {
                  count: classCount,
                  capacity: schoolClass.capacity,
                })}
              />
              <p className="text-xs text-muted-foreground tabular-nums">
                {tClasses("occupancyLabel", {
                  count: classCount,
                  capacity: schoolClass.capacity,
                })}
              </p>
            </div>
          ) : (
            <Badge variant="danger">{t("unknownClass")}</Badge>
          )}
        </DetailCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <DetailCard
          title={td("subjectsTitle")}
          description={td("subjectsCount", { count: subjectTotal })}
          icon={<BookOpen />}
          className="lg:col-span-2"
        >
          {subjectTotal === 0 ? (
            <p className="text-sm text-muted-foreground">{td("noSubjects")}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {row.subjects.map((subject) => (
                <li key={subject._id}>
                  <Badge variant="secondary" className="px-2.5 py-1 text-sm">
                    {subject.name}
                  </Badge>
                </li>
              ))}
              {row.unknownSubjectCount > 0 && (
                <li>
                  <Badge
                    variant="danger"
                    className="px-2.5 py-1 text-sm"
                    title={t("unknownSubject")}
                  >
                    {t("unknownSubjects", { count: row.unknownSubjectCount })}
                  </Badge>
                </li>
              )}
            </ul>
          )}
        </DetailCard>

        <DetailCard title={td("info")} icon={<CalendarDays />}>
          <dl className="grid grid-cols-2 gap-4">
            <Field label={td("firstName")}>{row.firstName}</Field>
            <Field label={td("lastName")}>{row.lastName}</Field>
            <Field label={td("createdAt")}>{formatDate(row.createdAt)}</Field>
            <Field label={td("updatedAt")}>{formatDate(row.updatedAt)}</Field>
          </dl>
        </DetailCard>
      </div>

      <StudentFormModal
        key={formKey}
        open={formOpen}
        student={current}
        onOpenChange={setFormOpen}
      />

      <DeleteStudentDialog
        student={current}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={(student) => {
          setRemoved(student);
          router.push("/students");
        }}
      />
    </div>
  );
}
