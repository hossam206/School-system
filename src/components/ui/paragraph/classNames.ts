import { cn } from "@/src/lib/utils";

// Base styles for the paragraph
export const baseStyles = "font-normal leading-relaxed";

// Size-based styles
export const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

// Color-based styles
export const colorStyles = {
  dark: "text-muted-foreground", // Default text color
  light: "text-muted", // Lighter text color (on dark surfaces)
  lightGray: "text-slate-400",
  darkGray: "text-foreground",
  error: "text-destructive", // Error text color
};

// Alignment-based styles
export const alignStyles = {
  left: "text-start",
  center: "text-center",
  right: "text-end",
};

// Utility function to combine styles
export const getParagraphStyles = (
  size: keyof typeof sizeStyles,
  color: keyof typeof colorStyles,
  align: keyof typeof alignStyles,
  className?: string
) => {
  return cn(
    baseStyles,
    sizeStyles[size],
    colorStyles[color],
    alignStyles[align],
    className
  );
};
