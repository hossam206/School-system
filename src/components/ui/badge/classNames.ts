import clx from "clsx";

export const badgeBaseStyles = clx(
  "inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium leading-5"
);

export const badgeVariantStyles = {
  default: clx("border-primary/20 bg-primary/10 text-primary"),
  secondary: clx("border-border bg-secondary text-slate-700"),
  success: clx("border-green-200 bg-green-50 text-green-700"),
  warning: clx("border-amber-200 bg-amber-50 text-amber-700"),
  danger: clx("border-red-200 bg-red-50 text-red-700"),
  outline: clx("border-border bg-transparent text-foreground"),
};

export type BadgeVariant = keyof typeof badgeVariantStyles;
