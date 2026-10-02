import { Skeleton } from "@/src/components/ui/skeleton";
import { TableRow, TableCell } from "@/src/components/ui/Table";

interface TableLoadingProps {
  columns: number;
  rows?: number;
  hasActions?: boolean;
}

export function TableLoading({
  columns,
  rows = 5,
  hasActions = false,
}: TableLoadingProps) {
  const totalColumns = hasActions ? columns + 1 : columns;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: totalColumns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function CardsLoading({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-xs"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </li>
      ))}
    </>
  );
}
