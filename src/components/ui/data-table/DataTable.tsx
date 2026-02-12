"use client"

import { cn } from "@/src/lib/utils"
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/src/components/ui/Table"
import { TableActions } from "./table-actions"
import { TableLoading } from "./table-loading"
import type { DataTableProps } from "./types"

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No data found.",
  skeletonRows = 5,
  onRowClick,
  getRowId,
  className,
}: DataTableProps<T>) {
  const hasActions = actions !== undefined && actions.length > 0

  return (
    <div className="rounded-md border border-border">
      <TableContainer className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="w-[60px] text-center">Actions</TableHead>
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

          {!loading && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            data.map((row, rowIndex) => {
              const rowKey = getRowId ? getRowId(row, rowIndex) : rowIndex

              return (
                <TableRow
                  key={rowKey}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    const cellValue = column.render
                      ? column.render(row)
                      : String(
                          (row as Record<string, unknown>)[
                            column.key as string
                          ] ?? ""
                        )

                    return (
                      <TableCell
                        key={String(column.key)}
                        className={column.className}
                      >
                        {cellValue}
                      </TableCell>
                    )
                  })}
                  {hasActions && (
                    <TableCell className="text-center">
                      <TableActions actions={actions!} row={row} />
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
        </TableBody>
      </TableContainer>
    </div>
  )
}
