import clx from "clsx";

// Action menu trigger styles
export const actionTriggerStyles = clx(
  "inline-flex items-center justify-center rounded-md p-1.5 cursor-pointer",
  "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
);

// Action menu item base styles
export const actionItemBaseStyles = clx(
  "w-full text-start px-3 py-2 text-sm cursor-pointer rounded-md",
  "transition-colors duration-150 outline-none"
);

// Action menu item variant styles
export const actionVariantStyles = {
  primary: clx("text-primary hover:bg-primary/10"),
  destructive: clx("text-destructive hover:bg-destructive/10"),
  secondary: clx("text-foreground hover:bg-accent"),
  default: clx("text-foreground hover:bg-accent"),
};
