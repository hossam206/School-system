import type { ReactNode } from "react";
import type { PaginationType } from "@/src/types/Pagination";

export type SortState = { key: string; dir: "asc" | "desc" } | null;

export type ColumnDef<T> = {
  key: keyof T | (string & {});
  header: string;
  render?: (row: T) => ReactNode;
  /** Makes the column sortable (used together with `sort` / `onSortChange`). */
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
  headerClassName?: string;
};

export type TableAction<T> = {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "outline";
  show?: (row: T) => boolean;
};

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  /** Pagination is hidden when absent, empty or `last_page <= 1`. */
  meta?: PaginationType;
  /** Search param used by the pagination links (default "page"). */
  pageParam?: string;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** Rendered when there are no rows (takes precedence over `emptyMessage`). */
  empty?: ReactNode;
  emptyMessage?: string;
  /** Header of the actions column (defaults to `common.actions`). */
  actionsLabel?: string;
  /** Card content for small screens: cards below `md`, table at `md` and up. */
  renderCard?: (row: T) => ReactNode;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string | number;
  className?: string;
}
