import type { ReactNode } from "react"

export type ColumnDef<T> = {
  key: keyof T | (string & {})
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

export type TableAction<T> = {
  label: string
  icon?: ReactNode
  onClick: (row: T) => void
  variant?: "default" | "destructive" | "outline"
  show?: (row: T) => boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: TableAction<T>[]
  loading?: boolean
  meta: { 
    current_page: number,
    from: number,
    to: number,
    last_page: number,
    per_page: number,
    total: number
  }
  emptyMessage?: string
  skeletonRows?: number
  onRowClick?: (row: T) => void
  getRowId?: (row: T, index: number) => string | number
  className?: string
}
