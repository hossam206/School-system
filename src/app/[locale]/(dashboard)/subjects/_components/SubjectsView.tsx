"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import {
  DataTable,
  type ColumnDef,
  type TableAction,
} from "@/src/components/ui/data-table";
import { EmptyState } from "@/src/components/ui/empty-state";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { PageHeader } from "@/src/components/ui/page-header";
import { Select } from "@/src/components/ui/select";
import TextInput from "@/src/components/ui/TextInput";
import { useClientTable } from "@/src/hooks/useClientTable";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import { schoolStore } from "@/src/store/schoolStore";
import type { Subject } from "@/src/types/school";
import { SubjectFormModal } from "./SubjectFormModal";

type SubjectRow = Subject & {
  gradeName: string | null;
  studentCount: number;
};

type FormState = {
  open: boolean;
  subject: Subject | null;
  session: number;
};

type GradeOption = { value: string; label: string };

const ALL_GRADES = "__all__";
const GRADE_PARAM = "grade";

function GradeBadge({
  row,
  unknownLabel,
}: {
  row: SubjectRow;
  unknownLabel: string;
}) {
  if (row.gradeName === null) {
    return <Badge variant="danger">{unknownLabel}</Badge>;
  }
  return (
    <Link
      href={`/grades/${encodeURIComponent(row.grade)}`}
      className="inline-flex max-w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <Badge
        variant="secondary"
        className="transition-colors hover:border-slate-300 hover:bg-slate-200"
      >
        {row.gradeName}
      </Badge>
    </Link>
  );
}

export default function SubjectsView() {
  const t = useTranslations("subjects");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const subjects = useSchoolData("subjects");
  const grades = useSchoolData("grades");
  const { gradeById, studentCountBySubject } = useLookups();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>({
    open: false,
    subject: null,
    session: 0,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubjectRow | null>(null);

  const noGrades = grades.length === 0;
  // The grade filter lives in the URL so other pages can link to /subjects?grade=<id>.
  const gradeFilter = searchParams.get(GRADE_PARAM) ?? "";
  const hasFilters = search.trim() !== "" || gradeFilter !== "";

  const replaceQuery = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchString);
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchString, pathname, router],
  );

  const openCreate = useCallback(() => {
    setForm((prev) => ({
      open: true,
      subject: null,
      session: prev.session + 1,
    }));
  }, []);

  const openEdit = useCallback((row: SubjectRow) => {
    setForm((prev) => ({
      open: true,
      subject: row,
      session: prev.session + 1,
    }));
  }, []);

  const openDelete = useCallback((row: SubjectRow) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  }, []);

  // `?create=1` opens the create modal once, then the param is removed.
  const createRequested = searchParams.get("create") === "1";
  const createHandled = useRef(false);
  useEffect(() => {
    if (!createRequested) {
      createHandled.current = false;
      return;
    }
    if (createHandled.current) return;
    createHandled.current = true;
    openCreate();
    replaceQuery({ create: null });
  }, [createRequested, openCreate, replaceQuery]);

  const rows = useMemo<SubjectRow[]>(
    () =>
      subjects.map((subject) => ({
        ...subject,
        gradeName: gradeById.get(subject.grade)?.name ?? null,
        studentCount: studentCountBySubject.get(subject._id) ?? 0,
      })),
    [subjects, gradeById, studentCountBySubject],
  );

  const columns = useMemo<ColumnDef<SubjectRow>[]>(
    () => [
      {
        key: "name",
        header: t("name"),
        sortValue: (row) => row.name,
        render: (row) => (
          <span className="font-medium text-foreground">{row.name}</span>
        ),
      },
      {
        key: "gradeName",
        header: t("grade"),
        sortValue: (row) => row.gradeName,
        render: (row) => (
          <GradeBadge row={row} unknownLabel={t("unknownGrade")} />
        ),
      },
      {
        key: "studentCount",
        header: t("students"),
        sortValue: (row) => row.studentCount,
        className: "w-32",
        render: (row) => (
          <span
            className={
              row.studentCount === 0
                ? "tabular-nums text-muted-foreground"
                : "tabular-nums text-foreground"
            }
          >
            {row.studentCount}
          </span>
        ),
      },
    ],
    [t],
  );

  const actions = useMemo<TableAction<SubjectRow>[]>(
    () => [
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
    ],
    [tc, openEdit, openDelete],
  );

  const gradeOptions = useMemo<GradeOption[]>(
    () => [
      { value: ALL_GRADES, label: t("allGrades") },
      ...grades.map((grade) => ({ value: grade._id, label: grade.name })),
    ],
    [grades, t],
  );

  const { pageRows, meta, total, sort, setSort } = useClientTable({
    rows,
    columns,
    search,
    searchText: (row) => row.name,
    filter: gradeFilter ? (row) => row.grade === gradeFilter : undefined,
    filterKey: gradeFilter,
  });

  const setGradeFilter = (value: string) => {
    replaceQuery({
      [GRADE_PARAM]: value === ALL_GRADES ? null : value,
      page: null,
    });
  };

  const clearFilters = () => {
    setSearch("");
    if (gradeFilter) replaceQuery({ [GRADE_PARAM]: null, page: null });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    schoolStore.getState().remove("subjects", deleteTarget._id);
    toast.success(t("deleted"));
    setDeleteOpen(false);
  };

  const createGradeLink = (
    <Link href="/grades" className={getButtonStyles(undefined, "btn-primary")}>
      <Plus aria-hidden />
      {t("noGradesHint")}
    </Link>
  );

  const clearFiltersButton = (
    <Button variant="ghost" prefix={<X aria-hidden />} onClick={clearFilters}>
      {tc("clearFilters")}
    </Button>
  );

  const empty =
    subjects.length === 0 ? (
      noGrades ? (
        <EmptyState
          icon={<BookOpen />}
          title={t("emptyTitle")}
          description={t("noGradesDescription")}
          action={createGradeLink}
        />
      ) : (
        <EmptyState
          icon={<BookOpen />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button prefix={<Plus aria-hidden />} onClick={openCreate}>
              {t("emptyAction")}
            </Button>
          }
        />
      )
    ) : (
      <EmptyState
        icon={<SearchX />}
        title={t("noResultsTitle")}
        description={tc("noResultsDescription")}
        action={hasFilters ? clearFiltersButton : undefined}
      />
    );

  const renderCard = (row: SubjectRow) => (
    <div className="flex flex-col gap-2">
      <p className="truncate font-medium text-foreground">{row.name}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <GradeBadge row={row} unknownLabel={t("unknownGrade")} />
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" aria-hidden />
          {t("studentCount", { count: row.studentCount })}
        </span>
      </div>
    </div>
  );

  const knownGradeFilter = gradeById.has(gradeFilter) ? gradeFilter : undefined;
  const deleteCount = deleteTarget?.studentCount ?? 0;

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <>
            {noGrades && (
              <Link
                href="/grades"
                className={getButtonStyles(undefined, "ghost")}
              >
                {t("noGradesHint")}
              </Link>
            )}
            <Button
              prefix={<Plus aria-hidden />}
              onClick={openCreate}
              disabled={noGrades}
              title={noGrades ? t("noGradesDescription") : undefined}
            >
              {t("add")}
            </Button>
          </>
        }
      />

      {subjects.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full sm:w-72">
            <label htmlFor="subjects-search" className="sr-only">
              {tc("search")}
            </label>
            <TextInput
              id="subjects-search"
              name="search"
              type="search"
              autocomplete="off"
              placeholder={t("searchPlaceholder")}
              prefix={<Search className="size-4" aria-hidden />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <label htmlFor="subjects-grade-filter" className="sr-only">
              {t("gradeFilter")}
            </label>
            <Select
              id="subjects-grade-filter"
              items={gradeOptions}
              valueKey="value"
              labelKey="label"
              value={gradeFilter || ALL_GRADES}
              onSelect={setGradeFilter}
              placeholder={t("allGrades")}
              searchPlaceholder={t("searchGrades")}
              emptyText={t("noGradesFound")}
              unknownLabel={t("unknownGrade")}
            />
          </div>
          {hasFilters && clearFiltersButton}
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
        renderCard={renderCard}
        empty={empty}
      />

      <SubjectFormModal
        open={form.open}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
        subject={form.subject}
        defaultGrade={knownGradeFilter}
        session={form.session}
      />

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        confirmVariant="destructive"
        title={t("deleteTitle")}
        description={
          <div className="flex flex-col gap-3">
            <p>{t("deleteDescription", { name: deleteTarget?.name ?? "" })}</p>
            {deleteCount > 0 ? (
              <div className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p>{t("deleteWarning", { students: deleteCount })}</p>
              </div>
            ) : (
              <p className="text-sm">{t("deleteSafe")}</p>
            )}
          </div>
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
