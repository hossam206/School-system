import { Skeleton } from "@/src/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <aside
      aria-hidden="true"
      className="sticky top-0 flex h-screen w-[68px] shrink-0 flex-col border-e border-border bg-card md:w-64"
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <Skeleton className="size-8 shrink-0" />
        <Skeleton className="hidden h-4 w-28 md:block" />
      </div>
      <div className="flex-1 space-y-2 p-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="size-5 shrink-0" />
            <Skeleton className="hidden h-4 w-24 md:block" />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SidebarSkeleton;
