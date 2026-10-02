import * as React from "react";
import {
  getButtonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/src/components/ui/Button/classNames";
import { cn } from "@/src/lib/utils";

type DashboardPanelProps = {
  id: string;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  summary?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function DashboardPanel({
  id,
  title,
  description,
  aside,
  summary,
  footer,
  children,
  className,
  bodyClassName,
}: DashboardPanelProps) {
  const titleId = `${id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h2>
            {description && (
              <div className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </div>
            )}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
        {summary && <div className="mt-4">{summary}</div>}
      </header>
      <div className={cn("flex-1 px-5 py-4", bodyClassName)}>{children}</div>
      {footer && (
        <div className="border-t border-border px-5 py-3">{footer}</div>
      )}
    </section>
  );
}

// Button look for locale-aware links (a <button> inside a link is invalid HTML).
export function linkButtonClass(
  variant: ButtonVariant = "default",
  size: ButtonSize = "md",
  className?: string,
) {
  return getButtonStyles(className, variant, false, false, size);
}

export const inlineLinkClass = cn(
  "rounded-sm font-medium text-foreground underline-offset-4 transition-colors",
  "hover:text-primary hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
);

export type { DashboardPanelProps };
