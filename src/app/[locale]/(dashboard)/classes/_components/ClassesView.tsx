"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  Pencil,
  Plus,
  School,
  Search,
  SearchX,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/src/components/ui/Button";
import { getButtonStyles } from "@/src/components/ui/Button/classNames";
import { Badge } from "@/src/components/ui/badge";
import {
  DataTable,
  type ColumnDef,
  type TableAction,
} from "@/src/components/ui/data-table";
import { EmptyState } from "@/src/components/ui/empty-state";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { Select } from "@/src/components/ui/select";
import TextInput from "@/src/components/ui/TextInput";
import { useClientTable } from "@/src/hooks/useClientTable";
import { useLookups, useSchoolData } from "@/src/hooks/useSchool";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { SchoolClass } from "@/src/types/school";
import { ClassDeleteDialog } from "./ClassDeleteDialog";
import { ClassFormModal } from "./ClassFormModal";
import { OccupancyBadge, occupancyRatio } from "./occupancy";

type ClassRow = SchoolClass & {
  gradeName: string | null;
  studentCount: number;
};

type FilterOption = { value: string; label: string };

const ALL = "__all";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function ClassesView() {
  const t = useTranslations("classes");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const classes = useSchoolData("classes");
  const grades = useSchoolData("grades");
  const { gradeById, studentCountByClass } = useLookups();
  const hasGrades = grades.length > 0;

  // Deep links: `?create=1` opens the create dialog, `?grade=<id>` pre-filters the list.
  const createParam = searchParams.get("create");
  const gradeParam = searchParams.get("grade");

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState(() => gradeParam ?? "");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [formState, setFormState] = useState<{
    open: boolean;
    item: SchoolClass | null;
  }>(() => ({ open: createParam === "1", item: null }));
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    item: SchoolClass | null;
  }>({ open: false, item: null });

  // React to the params changing while the page stays mounted (e.g. a second deep link).
  const [seenCreateParam, setSeenCreateParam] = useState(createParam);
  if (createParam !== seenCreateParam) {
    setSeenCreateParam(createParam);
    if (createParam === "1") setFormState({ open: true, item: null });
  }
  const [seenGradeParam, setSeenGradeParam] = useState(gradeParam);
  if (gradeParam !== seenGradeParam) {
    setSeenGradeParam(gradeParam);
    if (gradeParam) setGradeFilter(gradeParam);
  }

  // Once read, drop the deep-link params so a refresh doesn't reopen or re-filter.
  const searchString = searchParams.toString();
  useEffect(() => {
    if (createParam === null && gradeParam === null) return;
    const params = new URLSearchParams(searchString);
    params.delete("create");
    params.delete("grade");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [createParam, gradeParam, searchString, pathname, router]);

  const rows = useMemo<ClassRow[]>(
    () =>
      classes
        .map((item) => ({
          ...item,
          gradeName: gradeById.get(item.grade)?.name ?? null,
          studentCount: studentCountByClass.get(item._id) ?? 0,
        }))
        .sort((a, b) => collator.compare(a.classNum, b.classNum)),
    [classes, gradeById, studentCountByClass],
  );

  const gradeOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL, label: t("allGrades") },
      ...[...grades]
        .sort((a, b) => collator.compare(a.name, b.name))
        .map((grade) => ({ value: grade._id, label: grade.name })),
    ],
    [grades, t],
  );

  const buildingOptions = useMemo<FilterOption[]>(() => {
    const buildings = Array.from(
      new Set(
        classes
          .map((item) => item.buildingNum.trim())
          .filter((building) => building !== ""),
      ),
    ).sort(collator.compare);
    return [
      { value: ALL, label: t("allBuildings") },
      ...buildings.map((building) => ({
        value: building,
        label: t("buildingValue", { building }),
      })),
    ];
  }, [classes, t]);

  const columns = useMemo<ColumnDef<ClassRow>[]>(
    () => [
      {
        key: "classNum",
        header: t("singular"),
        sortValue: (row) => row.classNum,
        render: (row) => (
          <Link
            href={`/classes/${row._id}`}
            onClick={(event) => event.stopPropagation()}
            className="font-medium text-foreground underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:underline"
          >
            {row.classNum}
          </Link>
        ),
      },
      {
        key: "buildingNum",
        header: t("building"),
        sortValue: (row) => row.buildingNum,
      },
      {
        key: "floorNum",
        header: t("floor"),
        sortValue: (row) => row.floorNum,
        className: "tabular-nums",
      },
      {
        key: "grade",
        header: t("grade"),
        sortValue: (row) => row.gradeName,
        render: (row) =>
          row.gradeName ?? <Badge variant="danger">{t("unknownGrade")}</Badge>,
      },
      {
        key: "occupancy",
        header: t("occupancy"),
        sortValue: (row) => occupancyRatio(row.studentCount, row.capacity),
        render: (row) => (
          <OccupancyBadge count={row.studentCount} capacity={row.capacity} />
        ),
      },
    ],
    [t],
  );

  const activeBuilding = buildingFilter.trim();
  const hasFilters =
    search.trim() !== "" || gradeFilter !== "" || activeBuilding !== "";

  const { pageRows, meta, total, sort, setSort } = useClientTable<ClassRow>({
    rows,
    columns,
    search,
    searchText: (row) => `${row.classNum} ${row.buildingNum}`,
    filter: (row) =>
      (!gradeFilter || row.grade === gradeFilter) &&
      (!activeBuilding || row.buildingNum.trim() === activeBuilding),
    filterKey: `${gradeFilter}|${activeBuilding}`,
  });

  const clearFilters = () => {
    setSearch("");
    setGradeFilter("");
    setBuildingFilter("");
  };

  const openCreate = () => setFormState({ open: true, item: null });
  const openDetail = (item: SchoolClass) => router.push(`/classes/${item._id}`);

  const actions = useMemo<TableAction<ClassRow>[]>(
    () => [
      {
        label: tc("view"),
        icon: <Eye className="size-4" aria-hidden />,
        onClick: (row) => router.push(`/classes/${row._id}`),
      },
      {
        label: tc("edit"),
        icon: <Pencil className="size-4" aria-hidden />,
        onClick: (row) => setFormState({ open: true, item: row }),
      },
      {
        label: tc("delete"),
        icon: <Trash2 className="size-4" aria-hidden />,
        variant: "destructive",
        onClick: (row) => setDeleteState({ open: true, item: row }),
      },
    ],
    [tc, router],
  );

  const addButton = (
    <Button
      onClick={openCreate}
      disabled={!hasGrades}
      title={hasGrades ? undefined : t("noGradesHint")}
      prefix={<Plus className="size-4" aria-hidden />}
    >
      {t("add")}
    </Button>
  );

  const emptyCollection = hasGrades ? (
    <EmptyState
      icon={<School aria-hidden />}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={
        <Button
          onClick={openCreate}
          prefix={<Plus className="size-4" aria-hidden />}
        >
          {t("emptyAction")}
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={<School aria-hidden />}
      title={t("noGradesHint")}
      description={t("noGradesDescription")}
      action={
        <Link
          href="/grades?create=1"
          className={getButtonStyles(undefined, "default")}
        >
          <Plus className="size-4" aria-hidden />
          {t("createGrade")}
        </Link>
      }
    />
  );

  const emptyResults = (
    <EmptyState
      icon={<SearchX aria-hidden />}
      title={t("noResultsTitle")}
      description={tc("noResultsDescription")}
      action={
        <Button
          variant="outline"
          onClick={clearFilters}
          prefix={<X className="size-4" aria-hidden />}
        >
          {tc("clearFilters")}
        </Button>
      }
    />
  );

  const renderCard = (row: ClassRow) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/classes/${row._id}`}
          onClick={(event) => event.stopPropagation()}
          className="text-base font-semibold text-foreground outline-none hover:text-primary focus-visible:underline"
        >
          {t("classLabel", { classNum: row.classNum })}
        </Link>
        {row.gradeName ? (
          <Badge variant="secondary">{row.gradeName}</Badge>
        ) : (
          <Badge variant="danger">{t("unknownGrade")}</Badge>
        )}
      </div>
      <p className="text-muted-foreground">
        {t("location", { building: row.buildingNum, floor: row.floorNum })}
      </p>
      <div className="flex items-center gap-3">
        <ProgressBar
          value={row.studentCount}
          max={row.capacity}
          className="flex-1"
          aria-label={t("occupancyLabel", {
            count: row.studentCount,
            capacity: row.capacity,
          })}
        />
        <OccupancyBadge count={row.studentCount} capacity={row.capacity} />
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={addButton}
      />

      {classes.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full sm:max-w-xs sm:flex-1">
            <TextInput
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              autocomplete="off"
              prefix={<Search className="size-4" aria-hidden />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select<FilterOption>
              id="class-grade-filter"
              items={gradeOptions}
              valueKey="value"
              labelKey="label"
              value={gradeFilter || ALL}
              onSelect={(value) => setGradeFilter(value === ALL ? "" : value)}
              searchPlaceholder={t("searchGrades")}
              emptyText={t("noGradesFound")}
              unknownLabel={t("unknownGrade")}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select<FilterOption>
              id="class-building-filter"
              items={buildingOptions}
              valueKey="value"
              labelKey="label"
              value={buildingFilter || ALL}
              onSelect={(value) =>
                setBuildingFilter(value === ALL ? "" : value)
              }
              searchPlaceholder={tc("searchOptions")}
              emptyText={tc("noOptions")}
              unknownLabel={t("buildingValue", { building: buildingFilter })}
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              prefix={<X className="size-4" aria-hidden />}
            >
              {tc("clearFilters")}
            </Button>
          )}
          <p className="text-sm text-muted-foreground tabular-nums sm:ms-auto">
            {tc("resultsCount", { count: total })}
          </p>
        </div>
      )}

      <DataTable<ClassRow>
        data={pageRows}
        columns={columns}
        actions={actions}
        meta={meta}
        sort={sort}
        onSortChange={setSort}
        getRowId={(row) => row._id}
        onRowClick={openDetail}
        renderCard={renderCard}
        empty={classes.length === 0 ? emptyCollection : emptyResults}
      />

      <ClassFormModal
        open={formState.open}
        onOpenChange={(open) => setFormState((state) => ({ ...state, open }))}
        classItem={formState.item}
      />

      <ClassDeleteDialog
        open={deleteState.open}
        onOpenChange={(open) => setDeleteState((state) => ({ ...state, open }))}
        classItem={deleteState.item}
      />
    </div>
  );
}
