"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Eye,
  Info,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import TextInput from "@/src/components/ui/TextInput";
import { Select } from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { CopyButton } from "@/src/components/ui/copy-button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import {
  DataTable,
  type ColumnDef,
  type TableAction,
} from "@/src/components/ui/data-table";
import { useClientTable } from "@/src/hooks/useClientTable";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import type { Student } from "@/src/types/school";
import DeleteStudentDialog from "./DeleteStudentDialog";
import StudentFormModal from "./StudentFormModal";
import SubjectBadges from "./SubjectBadges";
import {
  classHref,
  collator,
  studentHref,
  toStudentRow,
  type StudentRow,
} from "./studentUtils";

const ALL = "__all__";

type FilterOption = { value: string; label: string };

type FormState = { open: boolean; student: Student | null; key: number };

const linkClass =
  "font-medium text-foreground hover:text-primary hover:underline underline-offset-4";

export default function StudentsView() {
  const t = useTranslations("students");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const students = useSchoolData("students");
  const classes = useSchoolData("classes");
  const grades = useSchoolData("grades");
  const lookups = useLookups();
  const { classById } = lookups;

  // Filters start from the URL (e.g. /students?class=c1) and then live here.
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [gradeFilter, setGradeFilter] = useState(
    () => searchParams.get("grade") ?? ""
  );
  const [classFilter, setClassFilter] = useState(
    () => searchParams.get("class") ?? ""
  );

  const [form, setForm] = useState<FormState>({
    open: false,
    student: null,
    key: 0,
  });
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const noClasses = classes.length === 0;

  const openCreate = () =>
    setForm((current) => ({ open: true, student: null, key: current.key + 1 }));
  const openEdit = (student: Student) =>
    setForm((current) => ({ open: true, student, key: current.key + 1 }));
  const openDelete = (student: Student) => {
    setDeleteTarget(student);
    setDeleteOpen(true);
  };

  // `?create=1` opens the create form once, then the param is removed.
  const wantsCreate = searchParams.get("create") === "1";
  useEffect(() => {
    if (!wantsCreate) return;
    setForm((current) => ({ open: true, student: null, key: current.key + 1 }));
    const params = new URLSearchParams(searchParams.toString());
    params.delete("create");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [wantsCreate, searchParams, pathname, router]);

  const rows = useMemo(
    () => students.map((student) => toStudentRow(student, lookups)),
    [students, lookups]
  );

  const gradeOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL, label: t("allGrades") },
      ...[...grades]
        .sort((a, b) => collator.compare(a.name, b.name))
        .map((grade) => ({ value: grade._id, label: grade.name })),
    ],
    [grades, t]
  );

  const classOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL, label: t("allClasses") },
      ...classes
        .filter((item) => !gradeFilter || item.grade === gradeFilter)
        .sort((a, b) => collator.compare(a.classNum, b.classNum))
        .map((item) => ({ value: item._id, label: item.classNum })),
    ],
    [classes, gradeFilter, t]
  );

  const hasFilters = search.trim() !== "" || !!gradeFilter || !!classFilter;

  const clearFilters = () => {
    setSearch("");
    setGradeFilter("");
    setClassFilter("");
  };

  const handleGradeFilter = (value: string) => {
    const next = value === ALL ? "" : value;
    setGradeFilter(next);
    // Keep the class filter only when that class belongs to the new grade.
    if (next && classFilter && classById.get(classFilter)?.grade !== next) {
      setClassFilter("");
    }
  };

  const handleClassFilter = (value: string) => {
    setClassFilter(value === ALL ? "" : value);
  };

  const columns = useMemo<ColumnDef<StudentRow>[]>(
    () => [
      {
        key: "studentId",
        header: t("studentId"),
        render: (row) => <CopyButton value={row.studentId} />,
        sortValue: (row) => row.studentId,
      },
      {
        key: "fullName",
        header: t("name"),
        render: (row) => (
          <Link
            href={studentHref(row._id)}
            className={linkClass}
            onClick={(event) => event.stopPropagation()}
          >
            {row.fullName}
          </Link>
        ),
        sortValue: (row) => row.fullName,
      },
      {
        key: "age",
        header: t("age"),
        className: "tabular-nums",
        sortValue: (row) => row.age,
      },
      {
        key: "class",
        header: t("class"),
        render: (row) =>
          row.schoolClass ? (
            <Link
              href={classHref(row.schoolClass._id)}
              className={linkClass}
              onClick={(event) => event.stopPropagation()}
            >
              {row.schoolClass.classNum}
            </Link>
          ) : (
            <Badge variant="danger">{t("unknownClass")}</Badge>
          ),
        sortValue: (row) => row.schoolClass?.classNum,
      },
      {
        key: "grade",
        header: t("grade"),
        render: (row) =>
          row.grade ? (
            <span className="text-foreground">{row.grade.name}</span>
          ) : row.schoolClass ? (
            <Badge variant="warning">{t("unknownGrade")}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        sortValue: (row) => row.grade?.name,
      },
      {
        key: "subjects",
        header: t("subjects"),
        className: "min-w-52 whitespace-normal",
        render: (row) => (
          <SubjectBadges
            subjects={row.subjects}
            unknownCount={row.unknownSubjectCount}
            max={3}
          />
        ),
      },
    ],
    [t]
  );

  const { pageRows, meta, total, sort, setSort } = useClientTable({
    rows,
    columns,
    search,
    searchText: (row) => `${row.fullName} ${row.studentId}`,
    filter: (row) =>
      (!gradeFilter || row.schoolClass?.grade === gradeFilter) &&
      (!classFilter || row.class === classFilter),
    filterKey: JSON.stringify([gradeFilter, classFilter]),
  });

  const actions: TableAction<StudentRow>[] = [
    {
      label: tc("view"),
      icon: <Eye className="size-4" aria-hidden />,
      onClick: (row) => router.push(studentHref(row._id)),
    },
    {
      label: tc("edit"),
      icon: <Pencil className="size-4" aria-hidden />,
      onClick: openEdit,
    },
    {
      label: tc("delete"),
      icon: <Trash2 className="size-4" aria-hidden />,
      variant: "destructive",
      onClick: openDelete,
    },
  ];

  const renderCard = (row: StudentRow) => (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Link
          href={studentHref(row._id)}
          className={linkClass}
          onClick={(event) => event.stopPropagation()}
        >
          {row.fullName}
        </Link>
        <span className="text-xs text-muted-foreground tabular-nums">
          {t("age")}: {row.age}
        </span>
      </div>
      <CopyButton value={row.studentId} className="w-fit" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {t("class")}:{" "}
          {row.schoolClass ? (
            <Link
              href={classHref(row.schoolClass._id)}
              className="font-medium text-foreground hover:text-primary hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              {row.schoolClass.classNum}
            </Link>
          ) : (
            <Badge variant="danger">{t("unknownClass")}</Badge>
          )}
        </span>
        {row.schoolClass && (
          <span>
            {t("grade")}:{" "}
            <span className="font-medium text-foreground">
              {row.grade?.name ?? t("unknownGrade")}
            </span>
          </span>
        )}
      </div>
      <SubjectBadges
        subjects={row.subjects}
        unknownCount={row.unknownSubjectCount}
        max={3}
      />
    </div>
  );

  const collectionEmpty = noClasses ? (
    <EmptyState
      icon={<Users />}
      title={t("emptyTitle")}
      description={t("noClassesDescription")}
      action={
        <Link
          href="/classes?create=1"
          className={getButtonStyles(undefined, "btn-primary")}
        >
          <Plus aria-hidden />
          {t("createClass")}
        </Link>
      }
    />
  ) : (
    <EmptyState
      icon={<Users />}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={
        <Button prefix={<Plus aria-hidden />} onClick={openCreate}>
          {t("emptyAction")}
        </Button>
      }
    />
  );

  const noResults = (
    <EmptyState
      icon={<SearchX />}
      title={t("noResultsTitle")}
      description={tc("noResultsDescription")}
      action={
        <Button
          variant="outline"
          prefix={<X aria-hidden />}
          onClick={clearFilters}
        >
          {tc("clearFilters")}
        </Button>
      }
    />
  );

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button
            prefix={<Plus aria-hidden />}
            onClick={openCreate}
            disabled={noClasses}
            title={noClasses ? t("noClassesHint") : undefined}
          >
            {t("add")}
          </Button>
        }
      />

      {noClasses && students.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {t("noClassesDescription")}
          </p>
          <Link
            href="/classes?create=1"
            className="shrink-0 font-medium text-primary hover:underline"
          >
            {t("createClass")}
          </Link>
        </div>
      )}

      {students.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full sm:w-72">
            <TextInput
              name="search"
              id="students-search"
              type="search"
              autocomplete="off"
              placeholder={t("searchPlaceholder")}
              prefix={<Search className="size-4" aria-hidden />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              id="students-grade-filter"
              items={gradeOptions}
              valueKey="value"
              labelKey="label"
              value={gradeFilter || ALL}
              onSelect={handleGradeFilter}
              placeholder={t("allGrades")}
              searchPlaceholder={tc("searchOptions")}
              emptyText={tc("noOptions")}
              unknownLabel={t("unknownGrade")}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              id="students-class-filter"
              items={classOptions}
              valueKey="value"
              labelKey="label"
              value={classFilter || ALL}
              onSelect={handleClassFilter}
              placeholder={t("allClasses")}
              searchPlaceholder={t("searchClasses")}
              emptyText={t("noClassesFound")}
              unknownLabel={t("unknownClass")}
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              prefix={<X aria-hidden />}
              onClick={clearFilters}
            >
              {tc("clearFilters")}
            </Button>
          )}
          <p className="text-sm text-muted-foreground tabular-nums sm:ms-auto">
            {tc("resultsCount", { count: total })}
          </p>
        </div>
      )}

      <DataTable
        data={pageRows}
        columns={columns}
        actions={actions}
        meta={meta}
        sort={sort}
        onSortChange={setSort}
        getRowId={(row) => row._id}
        onRowClick={(row) => router.push(studentHref(row._id))}
        renderCard={renderCard}
        empty={students.length === 0 ? collectionEmpty : noResults}
      />

      <StudentFormModal
        key={form.key}
        open={form.open}
        student={form.student}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
      />

      <DeleteStudentDialog
        student={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
