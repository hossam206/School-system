"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/select/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/select/popover";
import { labelFilter, selectStyles } from "./classNames";

interface MultiSelectProps<T> {
  items: T[];
  valueKey?: keyof T;
  labelKey?: keyof T;
  /** Custom option label (also used for searching). */
  getLabel?: (item: T) => string;
  value: string[];
  onChange: (value: string[]) => void;
  isOptionDisabled?: (item: T) => boolean;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
  touched?: boolean;
  mandatory?: boolean;
  disabled?: boolean;
  /** Called when the popover closes (mark the field as touched). */
  onBlur?: () => void;
  /** Maximum chips shown before collapsing the rest into "+N". */
  maxChips?: number;
  /** Chip label for selected values that match no item (defaults to `common.unknown`). */
  unknownLabel?: string;
  className?: string;
}

export function MultiSelect<T extends Record<string, any>>({
  items,
  valueKey = "value",
  labelKey = "label",
  getLabel,
  value,
  onChange,
  isOptionDisabled,
  id,
  name,
  label,
  placeholder,
  searchPlaceholder,
  emptyText,
  error,
  touched,
  mandatory = false,
  disabled = false,
  onBlur,
  maxChips,
  unknownLabel,
  className,
}: MultiSelectProps<T>) {
  const t = useTranslations("common");
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerId = id ?? name;
  const errorId = triggerId ? `${triggerId}-error` : undefined;
  const hasError = !!error && !!touched;
  const list = items ?? [];
  const selected = value ?? [];

  const keyOf = (item: T) => String(item[valueKey]);
  const labelOf = (item: T) =>
    getLabel ? getLabel(item) : String(item[labelKey] ?? item[valueKey] ?? "");

  const itemByKey = new Map(list.map((item) => [keyOf(item), item]));
  const chipLabel = (key: string) => {
    const item = itemByKey.get(key);
    return item ? labelOf(item) : (unknownLabel ?? t("unknown"));
  };

  const visibleCount =
    maxChips !== undefined && maxChips >= 0
      ? Math.min(maxChips, selected.length)
      : selected.length;
  const hiddenCount = selected.length - visibleCount;

  const handleOpenChange = (next: boolean) => {
    if (next && disabled) return;
    setOpen(next);
    if (!next) {
      setSearch("");
      onBlur?.();
    }
  };

  const toggle = (key: string) => {
    onChange(
      selected.includes(key)
        ? selected.filter((current) => current !== key)
        : [...selected, key]
    );
  };

  const remove = (key: string) => {
    onChange(selected.filter((current) => current !== key));
  };

  const removeLabel = (name: string) =>
    t.has("removeItem") ? t("removeItem", { name }) : name;

  return (
    <div className={selectStyles.wrapper}>
      {label && (
        <label htmlFor={triggerId} className={selectStyles.label}>
          {label}
          {mandatory && <span className={selectStyles.requiredMark}>*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverAnchor asChild>
          <div
            className={cn(
              selectStyles.field,
              open && selectStyles.fieldOpen,
              hasError && selectStyles.fieldError,
              disabled && selectStyles.fieldDisabled,
              className
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              {selected.slice(0, visibleCount).map((key) => {
                const text = chipLabel(key);
                return (
                  <span key={key} className={selectStyles.chip}>
                    <span className="truncate">{text}</span>
                    {!disabled && (
                      <button
                        type="button"
                        aria-label={removeLabel(text)}
                        className={selectStyles.chipRemove}
                        onClick={(event) => {
                          event.stopPropagation();
                          remove(key);
                        }}
                      >
                        <X className="size-3" aria-hidden />
                      </button>
                    )}
                  </span>
                );
              })}
              {hiddenCount > 0 && (
                <span className={cn(selectStyles.chip, "pe-2")}>
                  +{hiddenCount}
                </span>
              )}

              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={triggerId}
                  name={name}
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? errorId : undefined}
                  disabled={disabled}
                  className={selectStyles.fieldTrigger}
                >
                  <span className={selectStyles.placeholder}>
                    {selected.length === 0
                      ? (placeholder ?? (t.has("select") ? t("select") : ""))
                      : null}
                  </span>
                  <ChevronDown className={selectStyles.chevron} aria-hidden />
                </button>
              </PopoverTrigger>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent className={selectStyles.content} align="start">
          <Command filter={labelFilter}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={searchPlaceholder ?? t("search")}
              onKeyDown={(event) => {
                if (
                  event.key === "Backspace" &&
                  search === "" &&
                  selected.length > 0
                ) {
                  event.preventDefault();
                  remove(selected[selected.length - 1]);
                }
              }}
            />
            <CommandList className="scrollbar-modern">
              <CommandEmpty>{emptyText ?? t("noResults")}</CommandEmpty>
              <CommandGroup>
                {list.map((item) => {
                  const itemKey = keyOf(item);
                  const itemLabel = labelOf(item);
                  const isSelected = selected.includes(itemKey);
                  return (
                    <CommandItem
                      key={itemKey}
                      value={itemKey}
                      keywords={[itemLabel]}
                      disabled={isOptionDisabled?.(item) ?? false}
                      onSelect={() => toggle(itemKey)}
                      className={selectStyles.item}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-card"
                        )}
                        aria-hidden
                      >
                        {isSelected && (
                          <Check className="size-3 text-primary-foreground" />
                        )}
                      </span>
                      <span className="truncate">{itemLabel}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && (
        <p id={errorId} className={selectStyles.errorMsg}>
          {error}
        </p>
      )}
    </div>
  );
}

export type { MultiSelectProps };

// Formik usage:
// <MultiSelect
//   items={subjects}
//   valueKey="_id"
//   labelKey="name"
//   name="subjectsIds"
//   value={values.subjectsIds}
//   onChange={(ids) => {
//     setFieldTouched("subjectsIds", true, false);
//     setFieldValue("subjectsIds", ids);
//   }}
//   onBlur={() => setFieldTouched("subjectsIds", true)}
//   label="Subjects"
//   error={typeof errors.subjectsIds === "string" ? errors.subjectsIds : undefined}
//   touched={!!touched.subjectsIds}
// />
