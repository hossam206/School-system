import * as React from "react";
import { cn } from "@/src/lib/utils";
import {
  badgeBaseStyles,
  badgeVariantStyles,
  type BadgeVariant,
} from "./classNames";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeBaseStyles, badgeVariantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export type { BadgeProps, BadgeVariant };
