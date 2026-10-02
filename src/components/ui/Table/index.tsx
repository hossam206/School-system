"use client";

import * as React from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../select/popover";
import {
  actionTriggerStyles,
  actionItemBaseStyles,
  actionVariantStyles,
} from "./classNames";

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
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted/50 [&_tr]:border-b [&_tr]:hover:bg-transparent", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t border-border font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-4 text-start align-middle text-xs font-medium uppercase tracking-wide whitespace-nowrap text-muted-foreground",
        "[&:has([role=checkbox])]:pe-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap text-foreground",
        "[&:has([role=checkbox])]:pe-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// ─── Simple Table Types ──────────────────────────────────────────────────────

export interface TableColumnHeader<T> {
  id: keyof T & string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  value: string;
  variant?: keyof typeof actionVariantStyles;
  onclick: (row: T) => void;
}

export interface DataTableProps<T extends Record<string, any>> {
  headers: TableColumnHeader<T>[];
  data: T[];
  onClick?: (row: T) => void;
  haveActions?: boolean;
  actions?: TableAction<T>[];
  actionsLabel?: string;
  className?: string;
}

// ─── Actions Menu ────────────────────────────────────────────────────────────

function ActionsMenu<T extends Record<string, any>>({
  actions,
  row,
  label,
}: {
  actions: TableAction<T>[];
  row: T;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={actionTriggerStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {actions.map((action) => (
            <button
              type="button"
              key={action.value}
              className={cn(
                actionItemBaseStyles,
                actionVariantStyles[action.variant ?? "default"]
              )}
              onClick={(e) => {
                e.stopPropagation();
                action.onclick(row);
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Simple Table Component ──────────────────────────────────────────────────

function Table<T extends Record<string, any>>({
  headers,
  data,
  onClick,
  haveActions = false,
  actions = [],
  actionsLabel,
  className,
}: DataTableProps<T>) {
  const showActions = haveActions && actions.length > 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <TableBase className={className}>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.id} className={header.className}>
                {header.label}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-16 text-center">
                <span className={cn(!actionsLabel && "sr-only")}>
                  {actionsLabel}
                </span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(onClick && "cursor-pointer")}
              onClick={() => onClick?.(row)}
            >
              {headers.map((header) => (
                <TableCell key={header.id} className={header.className}>
                  {header.render
                    ? header.render(row[header.id], row)
                    : String(row[header.id] ?? "")}
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="text-center">
                  <ActionsMenu actions={actions} row={row} label={actionsLabel} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </TableBase>
    </div>
  );
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
};
