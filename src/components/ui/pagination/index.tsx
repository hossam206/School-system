"use client";
import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PaginationType } from "@/src/types/Pagination";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type PaginationProps = React.ComponentProps<"nav"> & {
  meta: PaginationType;
  onPageChange?: (page: number) => void;
};

function getPageNumbers(
  currentPage: number,
  lastPage: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
    return pages;
  }

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  // Pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < lastPage - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  pages.push(lastPage);

  return pages;
}

function Pagination({ meta, className, onPageChange, ...props }: PaginationProps) {
  const { last_page } = meta;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || meta.current_page;
  const [activePage, setActivePage] = React.useState(pageFromUrl);
  const pages = getPageNumbers(activePage, last_page);
  const locale = useLocale();
  const t = useTranslations("pagination");
  const isRtl = locale === "ar";

  React.useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || meta.current_page;
    setActivePage(urlPage);
  }, [searchParams, meta.current_page]);

  function handlePageChange(page: number) {
    setActivePage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    onPageChange?.(page);
  }

  const PrevIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      dir={isRtl ? "rtl" : "ltr"}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Previous */}
        <li>
          {activePage > 1 ? (
            <button
              onClick={() => handlePageChange(activePage - 1)}
              aria-label="Go to previous page"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <PrevIcon className="size-4" />
              <span className="hidden sm:block">{t("previous")}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm text-muted-foreground pointer-events-none opacity-50">
              <PrevIcon className="size-4" />
              <span className="hidden sm:block">{t("previous")}</span>
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`}>
              <span
                aria-hidden
                className="flex size-9 items-center justify-center"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            </li>
          ) : (
            <li key={page}>
              <button
                onClick={() => handlePageChange(page)}
                aria-current={page === activePage ? "page" : undefined}
                className={cn(
                  "inline-flex size-9  items-center justify-center rounded-md text-sm transition-colors cursor-pointer",
                  page === activePage
                    ? "border border-solid border-gray-200 transition-colors ease-in-out duration-200   cursor-pointer rounded-md text-primary-foreground pointer-events-none"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li>
          {activePage < last_page ? (
            <button
              onClick={() => handlePageChange(activePage + 1)}
              aria-label="Go to next page"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <span className="hidden sm:block">{t("next")}</span>
              <NextIcon className="size-4" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm text-muted-foreground pointer-events-none opacity-50"> 
              <span className="hidden  sm:block">{t("next")}</span>
              <NextIcon className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export { Pagination };
export type { PaginationType };
