import clx from "clsx";

// Shared field styles for Select and MultiSelect (match TextInput)
export const selectStyles = {
  wrapper: clx("flex flex-col gap-1.5"),
  label: clx(
    "flex flex-row items-center gap-1 text-sm font-medium text-foreground"
  ),
  requiredMark: clx("text-destructive"),
  trigger: clx(
    "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-start text-sm text-foreground shadow-xs",
    "transition-[color,box-shadow,border-color] outline-none cursor-pointer",
    "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
    "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-ring/30",
    "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50"
  ),
  triggerError: clx(
    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 data-[state=open]:border-destructive data-[state=open]:ring-destructive/30"
  ),
  placeholder: clx("truncate text-muted-foreground"),
  value: clx("flex min-w-0 items-center gap-2 truncate"),
  unknown: clx("truncate italic text-muted-foreground"),
  chevron: clx("size-4 shrink-0 text-muted-foreground"),
  content: clx("w-[var(--radix-popover-trigger-width)] min-w-[12rem] p-0"),
  item: clx("cursor-pointer"),
  check: clx("size-4 shrink-0 text-primary"),
  image: clx("size-5 rounded-full object-cover"),
  errorMsg: clx("text-xs text-destructive"),
  // MultiSelect
  field: clx(
    "flex min-h-9 w-full items-center gap-1 rounded-md border border-input bg-card py-1 ps-1.5 pe-1 text-sm text-foreground shadow-xs",
    "transition-[color,box-shadow,border-color]",
    "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30"
  ),
  fieldOpen: clx("border-primary ring-2 ring-ring/30"),
  fieldError: clx(
    "border-destructive focus-within:border-destructive focus-within:ring-destructive/30"
  ),
  fieldDisabled: clx("cursor-not-allowed bg-muted opacity-50"),
  chip: clx(
    "inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-secondary py-0.5 ps-2 pe-1 text-xs font-medium text-secondary-foreground"
  ),
  chipRemove: clx(
    "inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/40"
  ),
  fieldTrigger: clx(
    "flex h-7 min-w-0 flex-1 items-center justify-between gap-2 rounded-sm px-1.5 text-start outline-none cursor-pointer disabled:cursor-not-allowed"
  ),
};

// Search that only matches the visible label (item values are ids)
export const labelFilter = (
  _value: string,
  search: string,
  keywords?: string[]
) =>
  (keywords ?? [])
    .join(" ")
    .toLowerCase()
    .includes(search.trim().toLowerCase())
    ? 1
    : 0;
