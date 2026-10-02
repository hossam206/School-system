import { Skeleton } from "@/src/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <Skeleton className="h-9 w-full sm:w-44" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="hidden h-4 w-1/6 md:block" />
              <Skeleton className="ms-auto h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
