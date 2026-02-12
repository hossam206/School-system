"use client"

import { MoreHorizontal } from "lucide-react"
import { cn } from "@/src/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import type { TableAction } from "./types"

const actionVariantStyles = {
  default: "text-foreground",
  destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive",
  outline: "text-foreground",
} as const

interface TableActionsProps<T> {
  actions: TableAction<T>[]
  row: T
}

export function TableActions<T>({ actions, row }: TableActionsProps<T>) {
  const visibleActions = actions.filter(
    (action) => !action.show || action.show(row)
  )

  if (visibleActions.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center rounded-md p-1.5",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "transition-colors outline-none cursor-pointer"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className={cn(actionVariantStyles[action.variant ?? "default"])}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick(row)
            }}
          >
            {action.icon && (
              <span className="h-4 w-4 shrink-0">{action.icon}</span>
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
