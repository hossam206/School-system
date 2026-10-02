import * as React from "react";
import { Link } from "@/src/i18n/navigation";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/utils";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  loading?: boolean;
  hint?: React.ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  href,
  loading = false,
  hint,
  className,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
        {loading ? <Skeleton className="h-9 w-16" /> : value}
      </div>
      {hint && !loading && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
    </>
  );

  const baseStyles = cn(
    "block rounded-xl border border-border bg-card p-5 shadow-xs",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseStyles,
          "transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={baseStyles}>{content}</div>;
}

export type { StatCardProps };
