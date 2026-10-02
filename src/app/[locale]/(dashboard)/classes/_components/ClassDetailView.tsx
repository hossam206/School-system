"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  GraduationCap,
  Layers,
  Pencil,
  Presentation,
  SearchX,
  Trash2,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import { Badge } from "@/src/components/ui/badge";
import { CopyButton } from "@/src/components/ui/copy-button";
import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link, useRouter } from "@/src/i18n/navigation";
import type { Student } from "@/src/types/school";
import { ClassDeleteDialog } from "./ClassDeleteDialog";
import { ClassFormModal } from "./ClassFormModal";
import { occupancyLevel, occupancyVariant } from "./occupancy";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const fullName = (person: { firstName: string; lastName: string }) =>
  `${person.firstName} ${person.lastName}`.trim();

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-4">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold text-foreground">
        {children}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  description,
}: {
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        {title}
        <Badge variant="secondary" className="tabular-nums">
          {count}
        </Badge>
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ClassDetailView() {
  const t = useTranslations("classes");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const classes = useSchoolData("classes");
  const students = useSchoolData("students");
  const teachers = useSchoolData("teachers");
  const { gradeById } = useLookups();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const classItem = classes.find((item) => item._id === id);
  const classNum = classItem?.classNum.trim() ?? "";

  const classStudents = useMemo(
    () =>
      students
        .filter((student) => student.class === id)
        .sort((a, b) => collator.compare(fullName(a), fullName(b))),
    [students, id],
  );

  const classTeachers = useMemo(
    () =>
      classNum
        ? teachers
            .filter((teacher) => teacher.classNum.trim() === classNum)
            .sort((a, b) => collator.compare(fullName(a), fullName(b)))
        : [],
    [teachers, classNum],
  );

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
  };

  const studentColumns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        key: "studentId",
        header: t("detail.studentId"),
        render: (row) => <CopyButton value={row.studentId} />,
      },
      {
        key: "name",
        header: t("detail.studentName"),
        render: (row) => (
          <Link
            href={`/students/${row._id}`}
            onClick={(event) => event.stopPropagation()}
            className="font-medium text-foreground underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:underline"
          >
            {fullName(row)}
          </Link>
        ),
      },
      {
        key: "age",
        header: t("detail.studentAge"),
        className: "tabular-nums",
      },
    ],
    [t],
  );

  if (leaving) return <PageSkeleton />;

  if (!classItem) {
    return (
      <div>
        <PageHeader
          title={t("detail.pageTitle")}
          backHref="/classes"
          backLabel={t("detail.back")}
        />
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <EmptyState
            icon={<SearchX aria-hidden />}
            title={t("detail.notFoundTitle")}
            description={t("detail.notFoundDescription")}
            action={
              <Link href="/classes" className={getButtonStyles(undefined, "outline")}>
                {t("detail.backToList")}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const grade = gradeById.get(classItem.grade);
  const studentCount = classStudents.length;
  const { capacity } = classItem;
  const level = occupancyLevel(studentCount, capacity);
  const seatsLeft = Math.max(0, capacity - studentCount);

  return (
    <div>
      <PageHeader
        backHref="/classes"
        backLabel={t("detail.back")}
        title={t("detail.title", { classNum: classItem.classNum })}
        description={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              {tc("createdAt")}: {formatDate(classItem.createdAt)}
            </span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span>
              {tc("updatedAt")}: {formatDate(classItem.updatedAt)}
            </span>
          </div>
        }
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setFormOpen(true)}
              prefix={<Pencil className="size-4" aria-hidden />}
            >
              {tc("edit")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              prefix={<Trash2 className="size-4" aria-hidden />}
            >
              {tc("delete")}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={<Building2 aria-hidden />} label={t("detail.building")}>
          {classItem.buildingNum}
        </InfoCard>
        <InfoCard icon={<Layers aria-hidden />} label={t("detail.floor")}>
          <span className="tabular-nums">{classItem.floorNum}</span>
        </InfoCard>
        <InfoCard icon={<GraduationCap aria-hidden />} label={t("detail.grade")}>
          {grade ? (
            <Link
              href={`/grades/${grade._id}`}
              className="underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:underline"
            >
              {grade.name}
            </Link>
          ) : (
            <Badge variant="danger">{t("unknownGrade")}</Badge>
          )}
        </InfoCard>
        <InfoCard icon={<Users aria-hidden />} label={t("detail.capacity")}>
          <div className="flex items-center justify-between gap-2">
            <span className="tabular-nums">
              {t("capacityBadge", { count: studentCount, capacity })}
            </span>
            <Badge variant={occupancyVariant(studentCount, capacity)}>
              {t(level)}
            </Badge>
          </div>
          <ProgressBar
            value={studentCount}
            max={capacity}
            className="mt-3"
            aria-label={t("occupancyLabel", { count: studentCount, capacity })}
          />
          <p className="mt-2 text-xs font-normal text-muted-foreground">
            {level === "overCapacity"
              ? t("overCapacity")
              : t("seatsLeft", { count: seatsLeft })}
          </p>
        </InfoCard>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <SectionHeader
            title={t("detail.studentsTitle")}
            count={studentCount}
            description={t("detail.studentsDescription")}
          />
          <DataTable<Student>
            data={classStudents}
            columns={studentColumns}
            getRowId={(row) => row._id}
            onRowClick={(row) => router.push(`/students/${row._id}`)}
            renderCard={(row) => (
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/students/${row._id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="font-semibold text-foreground outline-none hover:text-primary focus-visible:underline"
                >
                  {fullName(row)}
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                  <CopyButton value={row.studentId} />
                  <span>
                    {t("detail.studentAge")}:{" "}
                    <span className="tabular-nums">{row.age}</span>
                  </span>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                icon={<Users aria-hidden />}
                title={t("detail.studentsEmpty")}
                description={t("detail.studentsEmptyDescription")}
                action={
                  <Link
                    href="/students?create=1"
                    className={getButtonStyles(undefined, "outline", false, false, "sm")}
                  >
                    {t("detail.addStudent")}
                  </Link>
                }
              />
            }
          />
        </section>

        <section className="min-w-0">
          <SectionHeader
            title={t("detail.teachersTitle")}
            count={classTeachers.length}
            description={t("detail.teachersDescription", {
              classNum: classItem.classNum,
            })}
          />
          <div className="rounded-lg border border-border bg-card shadow-sm">
            {classTeachers.length === 0 ? (
              <EmptyState
                icon={<Presentation aria-hidden />}
                title={t("detail.teachersEmpty")}
                description={t("detail.teachersEmptyDescription")}
                action={
                  <Link
                    href="/teachers?create=1"
                    className={getButtonStyles(undefined, "outline", false, false, "sm")}
                  >
                    {t("detail.addTeacher")}
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {classTeachers.map((teacher) => (
                  <li
                    key={teacher._id}
                    className="flex flex-col gap-1 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {fullName(teacher)}
                    </span>
                    <CopyButton
                      value={teacher.teacherId}
                      className="text-muted-foreground"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <ClassFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        classItem={classItem}
      />

      <ClassDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        classItem={classItem}
        onDeleted={() => {
          setLeaving(true);
          router.push("/classes");
        }}
      />
    </div>
  );
}
