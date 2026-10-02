"use client";

import { MoreHorizontal } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { TableAction } from "./types";

const actionVariantStyles = {
  default: "text-foreground",
  destructive:
    "text-destructive focus:bg-destructive/10 focus:text-destructive",
  outline: "text-foreground",
} as const;

interface TableActionsProps<T> {
  actions: TableAction<T>[];
  row: T;
  label?: string;
  className?: string;
}

export function TableActions<T>({
  actions,
  row,
  label,
  className,
}: TableActionsProps<T>) {
  const visibleActions = actions.filter(
    (action) => !action.show || action.show(row)
  );

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md",
            "text-muted-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted",
            "transition-colors outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/40",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {visibleActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className={cn(actionVariantStyles[action.variant ?? "default"])}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
          >
            {action.icon && (
              <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                {action.icon}
              </span>
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
