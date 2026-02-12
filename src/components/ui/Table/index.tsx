"use client"

import { cn } from "@/src/lib/utils"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../select/popover"
import { Ellipsis } from "lucide-react"
import {
  actionTriggerStyles,
  actionItemBaseStyles,
  actionVariantStyles,
} from "./classNames"

 
function TableBase({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto scrollbar-modern"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

// ─── DataTable Types ─────────────────────────────────────────────────────────

export interface TableColumnHeader<T> {
  id: keyof T & string
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

export interface TableAction<T> {
  label: string
  value: string
  variant?: keyof typeof actionVariantStyles
  onclick: (row: T) => void
}

export interface DataTableProps<T extends Record<string, any>> {
  headers: TableColumnHeader<T>[]
  data: T[]
  onClick?: (row: T) => void
  haveActions?: boolean
  actions?: TableAction<T>[]
  className?: string
}

// ─── Actions Menu ────────────────────────────────────────────────────────────

function ActionsMenu<T extends Record<string, any>>({
  actions,
  row,
}: {
  actions: TableAction<T>[]
  row: T
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={actionTriggerStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {actions.map((action) => (
            <button
              key={action.value}
              className={cn(
                actionItemBaseStyles,
                actionVariantStyles[action.variant ?? "default"]
              )}
              onClick={(e) => {
                e.stopPropagation()
                action.onclick(row)
                setOpen(false)
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── DataTable Component ─────────────────────────────────────────────────────

function Table<T extends Record<string, any>>({
  headers,
  data,
  onClick,
  haveActions = false,
  actions = [],
  className,
}: DataTableProps<T>) {
  return (
    <TableBase className={className}>
      <TableHeader>
        <TableRow>
          {headers.map((header , key) => (
            <TableHead key={key} className={header.className}>
              {header.label}
            </TableHead>
          ))}
          {haveActions && (
            <TableHead className="text-center">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            className={onClick ? "cursor-pointer" : ""}
            onClick={() => onClick?.(row)}
          >
            {headers.map((header , key) => (
              <TableCell key={key} className={header.className}>
                {header.render
                  ? header.render(row[key], row)
                  : String(row[key] ?? "")}
              </TableCell>
            ))}
            {haveActions && actions.length > 0 && (
              <TableCell className="text-center">
                <ActionsMenu actions={actions} row={row} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </TableBase>
  )
}


export {
  TableBase as TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Table,
}
