"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Pencil,
  Plus,
  School,
  SearchX,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import { Badge, type BadgeVariant } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { StatCard } from "@/src/components/ui/stat-card";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link, useRouter } from "@/src/i18n/navigation";
import { GradeDeleteModal } from "./GradeDeleteModal";
import { GradeFormModal } from "./GradeFormModal";
import { useDateFormatter } from "./useDateFormatter";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function occupancyVariant(count: number, capacity: number): BadgeVariant {
  if (capacity <= 0 || count >= capacity) return "danger";
  if (count / capacity >= 0.8) return "warning";
  return "secondary";
}

export default function GradeDetailView() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("grades");
  const tc = useTranslations("common");
  const tClasses = useTranslations("classes");
  const router = useRouter();
  const formatDate = useDateFormatter();

  const grades = useSchoolData("grades");
  const subjects = useSchoolData("subjects");
  const classes = useSchoolData("classes");
  const { studentCountByClass, studentCountBySubject } = useLookups();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const grade = grades.find((item) => item._id === id);

  const gradeSubjects = useMemo(
    () =>
      subjects
        .filter((subject) => subject.grade === id)
        .sort((a, b) => collator.compare(a.name, b.name)),
    [subjects, id],
  );

  const gradeClasses = useMemo(
    () =>
      classes
        .filter((item) => item.grade === id)
        .sort((a, b) => collator.compare(a.classNum, b.classNum)),
    [classes, id],
  );

  const studentTotal = gradeClasses.reduce(
    (sum, item) => sum + (studentCountByClass.get(item._id) ?? 0),
    0,
  );
  const seatTotal = gradeClasses.reduce((sum, item) => sum + item.capacity, 0);

  if (!grade) {
    // Just deleted from this page: render nothing while navigating back to the list.
    if (leaving) return null;

    return (
      <div>
        <PageHeader
          title={t("detail.pageTitle")}
          backHref="/grades"
          backLabel={t("detail.back")}
        />
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <EmptyState
            icon={<SearchX />}
            title={t("detail.notFoundTitle")}
            description={t("detail.notFoundDescription")}
            action={
              <Link href="/grades" className={getButtonStyles("", "outline")}>
                {t("detail.backToList")}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={grade.name}
        backHref="/grades"
        backLabel={t("detail.back")}
        description={
          <span className="flex flex-wrap gap-x-2 gap-y-1">
            <span>
              {t("detail.createdOn", { date: formatDate(grade.createdAt) })}
            </span>
            <span aria-hidden>·</span>
            <span>
              {t("detail.updatedOn", { date: formatDate(grade.updatedAt) })}
            </span>
          </span>
        }
        actions={
          <>
            <Button
              variant="outline"
              prefix={<Pencil />}
              onClick={() => setFormOpen(true)}
            >
              {tc("edit")}
            </Button>
            <Button
              variant="btn-delete"
              prefix={<Trash2 />}
              onClick={() => setDeleteOpen(true)}
            >
              {tc("delete")}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("subjects")}
          value={gradeSubjects.length}
          icon={<BookOpen />}
        />
        <StatCard
          label={t("classes")}
          value={gradeClasses.length}
          icon={<School />}
        />
        <StatCard
          label={t("students")}
          value={studentTotal}
          icon={<Users />}
          hint={
            gradeClasses.length > 0
              ? t("detail.seatsTaken", { used: studentTotal, total: seatTotal })
              : undefined
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title={t("detail.subjectsTitle")}
          description={t("detail.subjectsDescription")}
          action={
            gradeSubjects.length > 0 ? (
              <SectionLink href={`/subjects?grade=${grade._id}`}>
                {t("viewSubjects")}
              </SectionLink>
            ) : undefined
          }
        >
          {gradeSubjects.length === 0 ? (
            <EmptyState
              className="py-10"
              icon={<BookOpen />}
              title={t("detail.subjectsEmpty")}
              description={t("detail.subjectsEmptyDescription")}
              action={
                <Link
                  href="/subjects?create=1"
                  className={getButtonStyles("", "outline", false, false, "sm")}
                >
                  <Plus aria-hidden />
                  {t("detail.addSubject")}
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {gradeSubjects.map((subject) => (
                <li
                  key={subject._id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <BookOpen className="size-4" aria-hidden />
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {subject.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {t("studentCount", {
                      count: studentCountBySubject.get(subject._id) ?? 0,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title={t("detail.classesTitle")}
          description={t("detail.classesDescription")}
          action={
            gradeClasses.length > 0 ? (
              <SectionLink href={`/classes?grade=${grade._id}`}>
                {t("viewClasses")}
              </SectionLink>
            ) : undefined
          }
        >
          {gradeClasses.length === 0 ? (
            <EmptyState
              className="py-10"
              icon={<School />}
              title={t("detail.classesEmpty")}
              description={t("detail.classesEmptyDescription")}
              action={
                <Link
                  href="/classes?create=1"
                  className={getButtonStyles("", "outline", false, false, "sm")}
                >
                  <Plus aria-hidden />
                  {t("detail.addClass")}
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {gradeClasses.map((item) => {
                const count = studentCountByClass.get(item._id) ?? 0;
                const isFull = count >= item.capacity;
                const occupancy = tClasses("capacityBadge", {
                  count,
                  capacity: item.capacity,
                });

                return (
                  <li key={item._id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/classes/${item._id}`}
                          className="text-sm font-medium text-foreground transition-colors hover:text-primary outline-none focus-visible:underline"
                        >
                          {tClasses("classLabel", { classNum: item.classNum })}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {tClasses("location", {
                            building: item.buildingNum,
                            floor: item.floorNum,
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={occupancyVariant(count, item.capacity)}
                        className="shrink-0 tabular-nums"
                      >
                        {isFull
                          ? `${tClasses("full")} · ${occupancy}`
                          : occupancy}
                      </Badge>
                    </div>
                    <ProgressBar
                      value={count}
                      max={item.capacity}
                      className="mt-2 h-1.5"
                      aria-label={tClasses("occupancyLabel", {
                        count,
                        capacity: item.capacity,
                      })}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <GradeFormModal open={formOpen} onOpenChange={setFormOpen} grade={grade} />

      <GradeDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        grade={grade}
        onDeleted={() => {
          setLeaving(true);
          router.replace("/grades");
        }}
      />
    </div>
  );
}

type SectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-medium text-primary transition-colors hover:text-primary/80 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {children}
      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
    </Link>
  );
}
