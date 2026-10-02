import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel,
  className,
}: PageHeaderProps) {
  const t = useTranslations("common");

  return (
    <div className={cn("mb-6 flex flex-col gap-3", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {backLabel ?? t("back")}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export type { PageHeaderProps };
