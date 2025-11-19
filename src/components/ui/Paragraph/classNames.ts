import clx from "clsx";

// Base styles for the paragraph
export const baseStyles = "font-normal text-md leading-relaxed";

// Size-based styles
export const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

// Color-based styles
export const colorStyles = {
  dark: "text-gray-60", // Default text color
  light: "text-gray-10", // Lighter text color
  lightGray: "text-gray-50",
  darkGray: "text-gray-70",
  error: "text-red-500", // Error text color
};

// Alignment-based styles
export const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Utility function to combine styles
export const getParagraphStyles = (
  size: keyof typeof sizeStyles,
  color: keyof typeof colorStyles,
  align: keyof typeof alignStyles,
  className?: string
) => {
  return clx(
    baseStyles,
    sizeStyles[size],
    colorStyles[color],
    alignStyles[align],
    className
  );
};
