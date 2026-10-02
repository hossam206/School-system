"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef, SortState } from "@/src/components/ui/data-table";
import type { PaginationType } from "@/src/types/Pagination";

export type { SortState };

type SortValue = string | number | null | undefined;

type UseClientTableOptions<T extends Record<string, unknown>> = {
  rows: T[];
  columns: ColumnDef<T>[];
  search?: string;
  searchText?: (row: T) => string;
  filter?: (row: T) => boolean;
  /** Serialisable key of the active filters; the page resets when it changes. */
  filterKey?: string;
  perPage?: number;
  pageParam?: string;
};

type UseClientTableResult<T> = {
  pageRows: T[];
  meta: PaginationType;
  total: number;
  sort: SortState;
  setSort: (s: SortState) => void;
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function defaultSearchText(row: Record<string, unknown>): string {
  return Object.values(row)
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ");
}

function isEmptyValue(value: SortValue): value is null | undefined {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "number" && Number.isNaN(value))
  );
}

// Empty values always sort last, whatever the direction.
function compareSortValues(
  a: SortValue,
  b: SortValue,
  direction: 1 | -1,
): number {
  const aEmpty = isEmptyValue(a);
  const bEmpty = isEmptyValue(b);
  if (aEmpty || bEmpty) {
    if (aEmpty && bEmpty) return 0;
    return aEmpty ? 1 : -1;
  }
  const result =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : collator.compare(String(a), String(b));
  return result * direction;
}

function parsePage(raw: string | null): number | null {
  if (raw === null) return null;
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 ? page : null;
}

export function useClientTable<T extends Record<string, unknown>>({
  rows,
  columns,
  search,
  searchText,
  filter,
  filterKey = "",
  perPage = 10,
  pageParam = "page",
}: UseClientTableOptions<T>): UseClientTableResult<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortState>(null);

  const query = (search ?? "").trim().toLowerCase();
  const pageSize = Math.max(1, Math.floor(perPage));

  const filtered = rows.filter((row) => {
    if (filter && !filter(row)) return false;
    if (!query) return true;
    const text = searchText ? searchText(row) : defaultSearchText(row);
    return text.toLowerCase().includes(query);
  });

  const getSortValue = sort
    ? columns.find((column) => String(column.key) === sort.key)?.sortValue
    : undefined;
  const direction = sort?.dir === "desc" ? -1 : 1;

  const sorted = getSortValue
    ? filtered
        .map((row) => ({ row, value: getSortValue(row) }))
        .sort((a, b) => compareSortValues(a.value, b.value, direction))
        .map(({ row }) => row)
    : filtered;

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const searchString = searchParams.toString();
  const rawPage = searchParams.get(pageParam);
  const currentPage = Math.min(lastPage, parsePage(rawPage) ?? 1);

  const pageRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const meta: PaginationType = {
    current_page: currentPage,
    from: total === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, total),
    last_page: lastPage,
    per_page: pageSize,
    total,
  };

  // Built only from serialisable values, so inline filter/search functions never trigger a reset.
  const sortKey = sort ? `${sort.key}:${sort.dir}` : "";
  const resetKey = JSON.stringify([query, filterKey, sortKey]);
  // Starts at the first render's key, so the page from a shared link survives the first mount.
  const previousResetKey = useRef(resetKey);

  useEffect(() => {
    const criteriaChanged = previousResetKey.current !== resetKey;
    previousResetKey.current = resetKey;

    const params = new URLSearchParams(searchString);
    const raw = params.get(pageParam);
    // Nothing to fix when the page isn't in the URL, so this can never loop.
    if (raw === null) return;

    const page = parsePage(raw);
    let nextPage: number | null;
    if (criteriaChanged || page === null) {
      nextPage = null;
    } else if (page > lastPage) {
      nextPage = lastPage > 1 ? lastPage : null;
    } else {
      return;
    }

    if (nextPage === null) params.delete(pageParam);
    else params.set(pageParam, String(nextPage));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [resetKey, searchString, pageParam, lastPage, pathname, router]);

  return { pageRows, meta, total, sort, setSort };
}
