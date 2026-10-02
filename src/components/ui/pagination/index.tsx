"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/src/lib/utils";
import type { PaginationType } from "@/src/types/Pagination";

type PaginationProps = Omit<React.ComponentProps<"nav">, "children"> & {
  meta: PaginationType;
  onPageChange?: (page: number) => void;
  /** Search param that holds the page number (default "page"). */
  pageParam?: string;
};

function getPageNumbers(
  currentPage: number,
  lastPage: number
): (number | "ellipsis")[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);
  for (let page = start; page <= end; page++) pages.push(page);

  if (currentPage < lastPage - 2) pages.push("ellipsis");
  pages.push(lastPage);

  return pages;
}

const stepStyles = cn(
  "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-sm font-medium text-foreground",
  "transition-colors hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer",
  "focus-visible:ring-2 focus-visible:ring-ring/40",
  "disabled:pointer-events-none disabled:opacity-50"
);

function Pagination({
  meta,
  className,
  onPageChange,
  pageParam = "page",
  ...props
}: PaginationProps) {
  const t = useTranslations("pagination");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastPage = Math.max(1, meta.last_page);
  const currentPage = Math.min(Math.max(1, meta.current_page), lastPage);
  const pages = getPageNumbers(currentPage, lastPage);

  if (meta.last_page <= 1) return null;

  function goTo(page: number) {
    if (page < 1 || page > lastPage || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onPageChange?.(page);
  }

  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex", className)}
      {...props}
    >
      <ul className="flex flex-row flex-wrap items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label={t("previous")}
            className={stepStyles}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span className="hidden sm:inline">{t("previous")}</span>
          </button>
        </li>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden>
              <span className="flex size-9 items-center justify-center text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                onClick={() => goTo(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium tabular-nums",
                  "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  page === currentPage
                    ? "pointer-events-none border-primary bg-primary text-primary-foreground shadow-xs"
                    : "cursor-pointer border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {page}
              </button>
            </li>
          )
        )}

        <li>
          <button
            type="button"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage >= lastPage}
            aria-label={t("next")}
            className={stepStyles}
          >
            <span className="hidden sm:inline">{t("next")}</span>
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps, PaginationType };
