import clx from "clsx";

export const toasterStyles = {
  toastContainerStyles: clx(
    "group toast text-sm"
  ),
  description: clx("text-sm text-muted-foreground"),
  success: clx("[&_[data-icon]]:text-success"),
  error: clx("[&_[data-icon]]:text-destructive"),
  warning: clx("[&_[data-icon]]:text-warning"),
  info: clx("[&_[data-icon]]:text-primary"),
  actionButton: clx("!bg-primary !text-primary-foreground"),
  cancelButton: clx("!bg-muted !text-muted-foreground"),
};
