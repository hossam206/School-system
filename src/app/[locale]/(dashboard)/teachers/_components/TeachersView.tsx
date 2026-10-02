"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Info,
  Pencil,
  Plus,
  Presentation,
  Search,
  SearchX,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import Button from "@/src/components/ui/Button";
import { CopyButton } from "@/src/components/ui/copy-button";
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
import type { SchoolClass, Teacher } from "@/src/types/school";
import { TeacherFormModal } from "./TeacherFormModal";

const ALL_CLASSES = "__all__";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

type TeacherRow = Teacher & {
  fullName: string;
  schoolClass: SchoolClass | null;
  gradeName: string | null;
};

type FilterOption = { value: string; label: string };

type FormState = { open: boolean; teacher: Teacher | null; session: number };

type DeleteState = { open: boolean; teacher: Teacher | null };

function TeacherClass({ row }: { row: TeacherRow }) {
  const t = useTranslations("teachers");

  if (row.schoolClass) {
    return (
      <span className="inline-flex min-w-0 items-baseline gap-2">
        <Link
          href={`/classes/${row.schoolClass._id}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
          title={t("viewClass")}
        >
          {row.classNum}
        </Link>
        <span className="truncate text-xs text-muted-foreground">
          {row.gradeName ?? t("unknownGrade")}
        </span>
      </span>
    );
  }

  if (!row.classNum) {
    return <span className="text-muted-foreground">{t("unknownClass")}</span>;
  }

  return (
    <Badge variant="warning">
      {t("notKnownClassOption", { classNum: row.classNum })}
    </Badge>
  );
}

export default function TeachersView() {
  const t = useTranslations("teachers");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const teachers = useSchoolData("teachers");
  const classes = useSchoolData("classes");
  const { classByNum, gradeById } = useLookups();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [form, setForm] = useState<FormState>({
    open: false,
    teacher: null,
    session: 0,
  });
  const [pendingDelete, setPendingDelete] = useState<DeleteState>({
    open: false,
    teacher: null,
  });

  const hasClasses = classes.length > 0;
  const hasFilters = search.trim() !== "" || classFilter !== "";

  const openCreate = useCallback(() => {
    setForm((prev) => ({ open: true, teacher: null, session: prev.session + 1 }));
  }, []);

  const openEdit = useCallback((teacher: Teacher) => {
    setForm((prev) => ({ open: true, teacher, session: prev.session + 1 }));
  }, []);

  const clearFilters = () => {
    setSearch("");
    setClassFilter("");
  };

  // `?create=1` opens the create modal, then the param is removed from the URL.
  const wantsCreate = searchParams.get("create") === "1";
  useEffect(() => {
    if (!wantsCreate) return;
    openCreate();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("create");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [wantsCreate, openCreate, pathname, router, searchParams]);

  const rows = useMemo<TeacherRow[]>(
    () =>
      teachers.map((teacher) => {
        const schoolClass = classByNum.get(teacher.classNum) ?? null;
        return {
          ...teacher,
          fullName: `${teacher.firstName} ${teacher.lastName}`.trim(),
          schoolClass,
          gradeName: schoolClass
            ? (gradeById.get(schoolClass.grade)?.name ?? null)
            : null,
        };
      }),
    [teachers, classByNum, gradeById],
  );

  const classFilterOptions = useMemo<FilterOption[]>(() => {
    const known = new Set(classes.map((item) => item.classNum).filter(Boolean));
    const teacherOnly = new Set(
      teachers
        .map((teacher) => teacher.classNum)
        .filter((classNum) => classNum && !known.has(classNum)),
    );
    const knownOptions = [...known].sort(collator.compare).map((classNum) => {
      const schoolClass = classByNum.get(classNum);
      const grade = schoolClass ? gradeById.get(schoolClass.grade)?.name : undefined;
      return {
        value: classNum,
        label: t("classOptionGrade", {
          classNum,
          grade: grade ?? t("unknownGrade"),
        }),
      };
    });
    const teacherOnlyOptions = [...teacherOnly]
      .sort(collator.compare)
      .map((classNum) => ({
        value: classNum,
        label: t("notKnownClassOption", { classNum }),
      }));
    return [
      { value: ALL_CLASSES, label: t("allClasses") },
      ...knownOptions,
      ...teacherOnlyOptions,
    ];
  }, [classes, teachers, classByNum, gradeById, t]);

  const columns = useMemo<ColumnDef<TeacherRow>[]>(
    () => [
      {
        key: "teacherId",
        header: t("teacherId"),
        render: (row) => <CopyButton value={row.teacherId} />,
        className: "w-48",
      },
      {
        key: "fullName",
        header: tc("fullName"),
        sortValue: (row) => row.fullName,
        render: (row) => (
          <span className="font-medium text-foreground">{row.fullName}</span>
        ),
      },
      {
        key: "age",
        header: t("age"),
        sortValue: (row) => row.age,
        className: "w-24 tabular-nums",
      },
      {
        key: "classNum",
        header: t("classNum"),
        sortValue: (row) => row.classNum || null,
        render: (row) => <TeacherClass row={row} />,
      },
    ],
    [t, tc],
  );

  const actions = useMemo<TableAction<TeacherRow>[]>(
    () => [
      {
        label: tc("edit"),
        icon: <Pencil aria-hidden />,
        onClick: openEdit,
      },
      {
        label: tc("delete"),
        icon: <Trash2 aria-hidden />,
        variant: "destructive",
        onClick: (row) => setPendingDelete({ open: true, teacher: row }),
      },
    ],
    [tc, openEdit],
  );

  const { pageRows, meta, total, sort, setSort } = useClientTable({
    rows,
    columns,
    search,
    searchText: (row) => `${row.fullName} ${row.teacherId}`,
    filter: classFilter ? (row) => row.classNum === classFilter : undefined,
    filterKey: classFilter,
  });

  const confirmDelete = () => {
    const teacher = pendingDelete.teacher;
    if (!teacher) return;
    schoolStore.getState().remove("teachers", teacher._id);
    toast.success(t("deleted"));
    setPendingDelete((prev) => ({ ...prev, open: false }));
  };

  const renderCard = (row: TeacherRow) => (
    <div className="flex flex-col gap-2">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{row.fullName}</p>
        <CopyButton value={row.teacherId} className="mt-0.5" />
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">{t("age")}</dt>
          <dd className="tabular-nums text-foreground">{row.age}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">{t("classNum")}</dt>
          <dd className="min-w-0">
            <TeacherClass row={row} />
          </dd>
        </div>
      </dl>
    </div>
  );

  const emptyCollection = hasClasses ? (
    <EmptyState
      icon={<Presentation />}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={
        <Button onClick={openCreate} prefix={<Plus aria-hidden />}>
          {t("emptyAction")}
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={<Presentation />}
      title={t("emptyTitle")}
      description={t("noClassesDescription")}
      action={
        <Link
          href="/classes?create=1"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Plus className="size-4" aria-hidden />
          {t("noClassesHint")}
        </Link>
      }
    />
  );

  const emptyResults = (
    <EmptyState
      icon={<SearchX />}
      title={t("noResultsTitle")}
      description={tc("noResultsDescription")}
      action={
        <Button variant="outline" onClick={clearFilters} prefix={<X aria-hidden />}>
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
            onClick={openCreate}
            disabled={!hasClasses}
            title={hasClasses ? undefined : t("noClassesHint")}
            prefix={<Plus aria-hidden />}
          >
            {t("add")}
          </Button>
        }
      />

      {!hasClasses && teachers.length > 0 && (
        <div className="mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="min-w-0">
            {t("noClassesDescription")}{" "}
            <Link
              href="/classes?create=1"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("createClass")}
            </Link>
          </p>
        </div>
      )}

      {teachers.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full sm:w-72">
            <label htmlFor="teachers-search" className="sr-only">
              {tc("search")}
            </label>
            <TextInput
              id="teachers-search"
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
            <Select
              id="teachers-class-filter"
              name="classFilter"
              items={classFilterOptions}
              valueKey="value"
              labelKey="label"
              value={classFilter || ALL_CLASSES}
              onSelect={(value) =>
                setClassFilter(value === ALL_CLASSES ? "" : value)
              }
              placeholder={t("allClasses")}
              searchPlaceholder={t("searchClasses")}
              emptyText={t("noClassesFound")}
              unknownLabel={t("unknownClass")}
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} prefix={<X aria-hidden />}>
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
        renderCard={renderCard}
        empty={teachers.length === 0 ? emptyCollection : emptyResults}
      />

      <TeacherFormModal
        open={form.open}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
        teacher={form.teacher}
        session={form.session}
      />

      <ConfirmModal
        open={pendingDelete.open}
        onOpenChange={(open) => setPendingDelete((prev) => ({ ...prev, open }))}
        title={t("deleteTitle")}
        description={
          pendingDelete.teacher
            ? t("deleteDescription", {
                name: `${pendingDelete.teacher.firstName} ${pendingDelete.teacher.lastName}`.trim(),
              })
            : undefined
        }
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
