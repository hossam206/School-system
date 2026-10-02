import clx from "clsx";
import { cn } from "@/src/lib/utils";

// Base button styles (no background: every variant sets its own colours)
export const baseButtonStyles = clx(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
  "transition-colors duration-150 ease-in-out outline-none cursor-pointer select-none",
  "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
);

const primaryStyles = clx(
  "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
);
const secondaryStyles = clx(
  "bg-secondary text-secondary-foreground hover:bg-slate-200"
);
const destructiveStyles = clx(
  "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90"
);
const borderedStyles = clx(
  "border border-input bg-card text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground"
);

// Variant styles
export const variantStyles = {
  default: primaryStyles,
  "btn-primary": primaryStyles,
  secondary: secondaryStyles,
  "btn-secondary": secondaryStyles,
  destructive: destructiveStyles,
  "btn-delete": destructiveStyles,
  "btn-cancel": borderedStyles,
  outline: borderedStyles,
  ghost: clx("text-foreground hover:bg-accent hover:text-accent-foreground"),
  success: clx(
    "bg-success text-success-foreground shadow-xs hover:bg-success/90"
  ),
  error: destructiveStyles,
  loading: clx("cursor-wait"),
  disabled: "",
  idle: "",
};

// Size styles
export const sizeStyles = {
  sm: clx("h-8 px-3 text-xs"),
  md: clx("h-9 px-4 text-sm"),
  lg: clx("h-10 px-6 text-sm"),
  icon: clx("size-9 p-0 text-sm"),
};

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

// Get styles based on variant, size and status
export const getButtonStyles = (
  className?: string,
  variant?: ButtonVariant,
  isLoading?: boolean,
  _disabled?: boolean,
  size: ButtonSize = "md"
) => {
  return cn(
    baseButtonStyles,
    sizeStyles[size],
    variantStyles[variant ?? "default"],
    isLoading && variantStyles.loading,
    className
  );
};
