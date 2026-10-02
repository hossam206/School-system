"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/src/components/ui/Table";
import { Pagination } from "@/src/components/ui/pagination";
import { TableActions } from "./table-actions";
import { CardsLoading, TableLoading } from "./table-loading";
import type { ColumnDef, DataTableProps, SortState } from "./types";

function nextSort(current: SortState | undefined, key: string): SortState {
  if (!current || current.key !== key) return { key, dir: "asc" };
  if (current.dir === "asc") return { key, dir: "desc" };
  return null;
}

function cellContent<T>(column: ColumnDef<T>, row: T): React.ReactNode {
  if (column.render) return column.render(row);
  const value = (row as Record<string, unknown>)[String(column.key)];
  return value === null || value === undefined ? "" : String(value);
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  loading = false,
  meta,
  pageParam = "page",
  sort,
  onSortChange,
  empty,
  emptyMessage,
  actionsLabel,
  renderCard,
  skeletonRows = 5,
  onRowClick,
  getRowId,
  className,
}: DataTableProps<T>) {
  const t = useTranslations("common");
  const tp = useTranslations("pagination");
  const hasActions = actions !== undefined && actions.length > 0;
  const actionsText = actionsLabel ?? t("actions");
  const isEmpty = !loading && data.length === 0;
  const showPagination = !!meta && meta.total > 0 && meta.last_page > 1;
  const hasCards = !!renderCard;

  const emptyContent = empty ?? (
    <p className="py-10 text-center text-sm text-muted-foreground">
      {emptyMessage ?? t("noResults")}
    </p>
  );

  const rowKeyOf = (row: T, index: number) =>
    getRowId ? getRowId(row, index) : index;

  const renderHead = (column: ColumnDef<T>) => {
    const key = String(column.key);
    const sortable = !!column.sortValue && !!onSortChange;
    const active = sortable && sort?.key === key ? sort.dir : null;
    const SortIcon =
      active === "asc" ? ArrowUp : active === "desc" ? ArrowDown : ChevronsUpDown;

    return (
      <TableHead
        key={key}
        className={cn(column.className, column.headerClassName)}
        aria-sort={
          sortable
            ? active === "asc"
              ? "ascending"
              : active === "desc"
                ? "descending"
                : "none"
            : undefined
        }
      >
        {sortable ? (
          <button
            type="button"
            onClick={() => onSortChange?.(nextSort(sort, key))}
            className={cn(
              "-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 uppercase tracking-wide",
              "transition-colors hover:bg-muted hover:text-foreground outline-none cursor-pointer",
              "focus-visible:ring-2 focus-visible:ring-ring/40",
              active && "text-foreground"
            )}
          >
            {column.header}
            <SortIcon
              className={cn("size-3.5", !active && "opacity-50")}
              aria-hidden
            />
          </button>
        ) : (
          column.header
        )}
      </TableHead>
    );
  };

  return (
    <section className="flex flex-col gap-4">
      {hasCards && (
        <div className="md:hidden">
          {isEmpty ? (
            <div className="rounded-lg border border-border bg-card shadow-xs">
              {emptyContent}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {loading ? (
                <CardsLoading rows={skeletonRows} />
              ) : (
                data.map((row, rowIndex) => (
                  <li
                    key={rowKeyOf(row, rowIndex)}
                    className={cn(
                      "relative rounded-lg border border-border bg-card p-4 text-sm shadow-xs transition-colors",
                      onRowClick && "cursor-pointer hover:border-primary/40",
                      hasActions && "pe-12"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {renderCard(row)}
                    {hasActions && (
                      <div className="absolute top-2 end-2">
                        <TableActions
                          actions={actions}
                          row={row}
                          label={actionsText}
                        />
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-card shadow-xs",
          hasCards && "hidden md:block"
        )}
      >
        <TableContainer className={className}>
          <TableHeader>
            <TableRow>
              {columns.map(renderHead)}
              {hasActions && (
                <TableHead className="w-20 text-center">{actionsText}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableLoading
                columns={columns.length}
                rows={skeletonRows}
                hasActions={hasActions}
              />
            )}

            {isEmpty && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="p-0 whitespace-normal"
                >
                  {emptyContent}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowKeyOf(row, rowIndex)}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={column.className}
                    >
                      {cellContent(column, row)}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="w-20 py-2 text-center">
                      <TableActions
                        actions={actions}
                        row={row}
                        label={actionsText}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </TableContainer>
      </div>

      {showPagination && (
        <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground tabular-nums">
            {tp.has("showing")
              ? tp("showing", { from: meta.from, to: meta.to, total: meta.total })
              : null}
          </p>
          <Pagination meta={meta} pageParam={pageParam} />
        </div>
      )}
    </section>
  );
}
