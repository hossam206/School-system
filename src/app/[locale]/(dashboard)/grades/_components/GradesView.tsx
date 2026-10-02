"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/badge";
import {
  DataTable,
  type ColumnDef,
  type TableAction,
} from "@/src/components/ui/data-table";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import TextInput from "@/src/components/ui/TextInput";
import { useClientTable } from "@/src/hooks/useClientTable";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { Grade } from "@/src/types/school";
import { GradeDeleteModal } from "./GradeDeleteModal";
import { GradeFormModal } from "./GradeFormModal";
import { useDateFormatter } from "./useDateFormatter";

type GradeRow = Grade & {
  subjectCount: number;
  classCount: number;
};

type FormState = { open: boolean; grade: Grade | null };
type DeleteState = { open: boolean; grade: Grade | null };

const SEARCH_ID = "grades-search";

export default function GradesView() {
  const t = useTranslations("grades");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formatDate = useDateFormatter();

  const grades = useSchoolData("grades");
  const { subjectCountByGrade, classCountByGrade } = useLookups();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>({ open: false, grade: null });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    grade: null,
  });

  const openCreate = () => setForm({ open: true, grade: null });
  const clearFilters = () => setSearch("");

  // `?create=1` opens the create modal, then the param is removed from the URL.
  const createRequested = searchParams.get("create") === "1";
  useEffect(() => {
    if (!createRequested) return;
    setForm({ open: true, grade: null });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("create");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [createRequested, searchParams, pathname, router]);

  const rows = useMemo<GradeRow[]>(
    () =>
      grades.map((grade) => ({
        ...grade,
        subjectCount: subjectCountByGrade.get(grade._id) ?? 0,
        classCount: classCountByGrade.get(grade._id) ?? 0,
      })),
    [grades, subjectCountByGrade, classCountByGrade],
  );

  const columns = useMemo<ColumnDef<GradeRow>[]>(
    () => [
      {
        key: "name",
        header: t("name"),
        sortValue: (row) => row.name,
        render: (row) => (
          <Link
            href={`/grades/${row._id}`}
            onClick={(event) => event.stopPropagation()}
            className="font-medium text-foreground transition-colors hover:text-primary outline-none focus-visible:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        key: "subjectCount",
        header: t("subjects"),
        sortValue: (row) => row.subjectCount,
        render: (row) => <CountCell value={row.subjectCount} />,
      },
      {
        key: "classCount",
        header: t("classes"),
        sortValue: (row) => row.classCount,
        render: (row) => <CountCell value={row.classCount} />,
      },
      {
        key: "createdAt",
        header: t("createdAt"),
        sortValue: (row) => Date.parse(row.createdAt),
        className: "whitespace-nowrap text-muted-foreground",
        render: (row) => formatDate(row.createdAt),
      },
    ],
    [t, formatDate],
  );

  const actions = useMemo<TableAction<GradeRow>[]>(
    () => [
      {
        label: tc("edit"),
        icon: <Pencil />,
        onClick: (row) => setForm({ open: true, grade: row }),
      },
      {
        label: tc("delete"),
        icon: <Trash2 />,
        variant: "destructive",
        onClick: (row) => setDeleteState({ open: true, grade: row }),
      },
    ],
    [tc],
  );

  const { pageRows, meta, total, sort, setSort } = useClientTable({
    rows,
    columns,
    search,
    searchText: (row) => row.name,
  });

  const hasGrades = grades.length > 0;
  const hasFilters = search.trim().length > 0;

  const renderCard = (row: GradeRow) => (
    <div className="flex flex-col gap-2">
      <Link
        href={`/grades/${row._id}`}
        onClick={(event) => event.stopPropagation()}
        className="w-fit text-base font-medium text-foreground hover:text-primary"
      >
        {row.name}
      </Link>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">
          {t("subjectCount", { count: row.subjectCount })}
        </Badge>
        <Badge variant="secondary">
          {t("classCount", { count: row.classCount })}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("createdAt")}: {formatDate(row.createdAt)}
      </p>
    </div>
  );

  const empty = hasGrades ? (
    <EmptyState
      icon={<SearchX />}
      title={t("noResultsTitle")}
      description={tc("noResultsDescription")}
      action={
        <Button variant="outline" prefix={<X />} onClick={clearFilters}>
          {tc("clearFilters")}
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={<GraduationCap />}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={
        <Button variant="btn-primary" prefix={<Plus />} onClick={openCreate}>
          {t("emptyAction")}
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
          <Button variant="btn-primary" prefix={<Plus />} onClick={openCreate}>
            {t("add")}
          </Button>
        }
      />

      {hasGrades && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-72">
            <label htmlFor={SEARCH_ID} className="sr-only">
              {tc("search")}
            </label>
            <TextInput
              id={SEARCH_ID}
              name="search"
              placeholder={t("searchPlaceholder")}
              autocomplete="off"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<Search className="size-4" aria-hidden />}
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" prefix={<X />} onClick={clearFilters}>
              {tc("clearFilters")}
            </Button>
          )}
          <p className="ms-auto text-sm text-muted-foreground tabular-nums">
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
        empty={empty}
        renderCard={renderCard}
        getRowId={(row) => row._id}
        onRowClick={(row) => router.push(`/grades/${row._id}`)}
      />

      <GradeFormModal
        open={form.open}
        grade={form.grade}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
      />

      <GradeDeleteModal
        open={deleteState.open}
        grade={deleteState.grade}
        onOpenChange={(open) => setDeleteState((prev) => ({ ...prev, open }))}
      />
    </div>
  );
}

function CountCell({ value }: { value: number }) {
  return (
    <span
      className={
        value === 0
          ? "tabular-nums text-muted-foreground"
          : "tabular-nums text-foreground"
      }
    >
      {value}
    </span>
  );
}
