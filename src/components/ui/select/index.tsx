"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
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
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/select/popover";
import { labelFilter, selectStyles } from "./classNames";

interface SelectProps<T> {
  items: T[];
  valueKey?: keyof T;
  labelKey?: keyof T;
  /** Custom option label (also used for searching). */
  getLabel?: (item: T) => string;
  /** Optional image key rendered before the label. */
  displayImg?: keyof T;
  /** Controlled value (`null` / "" for nothing selected). Controlled when not `undefined`. */
  value?: string | null;
  /** Initial value for uncontrolled use (ignored when `value` is passed). */
  defaultValue?: string | null;
  /** Called with the option's value as a string ("" when the selection is cleared). */
  onSelect?: (value: string, item: T) => void;
  isOptionDisabled?: (item: T) => boolean;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  touched?: boolean;
  mandatory?: boolean;
  /** When true, choosing the selected option again clears it (default false). */
  clearable?: boolean;
  disabled?: boolean;
  /** Called when the popover closes without a selection (mark the field as touched). */
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Shown when `value` is set but matches no item (defaults to `common.unknown`). */
  unknownLabel?: string;
  className?: string;
}

const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === "";

export function Select<T extends Record<string, any>>({
  items,
  valueKey = "value",
  labelKey = "label",
  getLabel,
  displayImg,
  value,
  defaultValue = null,
  onSelect,
  isOptionDisabled,
  id,
  name,
  label,
  error,
  touched,
  mandatory = false,
  clearable = false,
  disabled = false,
  onBlur,
  placeholder,
  searchPlaceholder,
  emptyText,
  unknownLabel,
  className,
}: SelectProps<T>) {
  const t = useTranslations("common");
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = !isEmptyValue(currentValue);
  const selectedKey = hasValue ? String(currentValue) : "";
  const triggerId = id ?? name;
  const errorId = triggerId ? `${triggerId}-error` : undefined;
  const hasError = !!error && !!touched;
  const list = items ?? [];

  const keyOf = (item: T) => String(item[valueKey]);
  const labelOf = (item: T) =>
    getLabel ? getLabel(item) : String(item[labelKey] ?? item[valueKey] ?? "");

  const selectedItem = hasValue
    ? list.find((item) => keyOf(item) === selectedKey)
    : undefined;

  // Closing without choosing an option counts as a blur
  const handleOpenChange = (next: boolean) => {
    if (next && disabled) return;
    setOpen(next);
    if (!next) onBlur?.();
  };

  const handleSelect = (item: T) => {
    const itemKey = keyOf(item);
    const alreadySelected = hasValue && itemKey === selectedKey;
    setOpen(false);
    if (alreadySelected && !clearable) {
      onBlur?.();
      return;
    }
    const nextValue = alreadySelected ? "" : itemKey;
    if (!isControlled) setInternalValue(nextValue);
    onSelect?.(nextValue, item);
  };

  const renderImage = (item: T) =>
    displayImg && item[displayImg] ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={String(item[displayImg])}
        alt=""
        className={selectStyles.image}
      />
    ) : null;

  return (
    <div className={selectStyles.wrapper}>
      {label && (
        <label htmlFor={triggerId} className={selectStyles.label}>
          {label}
          {mandatory && <span className={selectStyles.requiredMark}>*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={handleOpenChange} modal>
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
            className={cn(
              selectStyles.trigger,
              hasError && selectStyles.triggerError,
              className
            )}
          >
            {selectedItem ? (
              <span className={selectStyles.value}>
                {renderImage(selectedItem)}
                <span className="truncate">{labelOf(selectedItem)}</span>
              </span>
            ) : hasValue ? (
              <span className={selectStyles.unknown}>
                {unknownLabel ?? t("unknown")}
              </span>
            ) : (
              <span className={selectStyles.placeholder}>
                {placeholder ?? (t.has("select") ? t("select") : "")}
              </span>
            )}
            <ChevronDown className={selectStyles.chevron} aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent className={selectStyles.content} align="start">
          <Command filter={labelFilter} defaultValue={selectedKey || undefined}>
            <CommandInput placeholder={searchPlaceholder ?? t("search")} />
            <CommandList className="scrollbar-modern">
              <CommandEmpty>{emptyText ?? t("noResults")}</CommandEmpty>
              <CommandGroup>
                {list.map((item) => {
                  const itemKey = keyOf(item);
                  const itemLabel = labelOf(item);
                  const selected = hasValue && itemKey === selectedKey;
                  return (
                    <CommandItem
                      key={itemKey}
                      value={itemKey}
                      keywords={[itemLabel]}
                      disabled={isOptionDisabled?.(item) ?? false}
                      onSelect={() => handleSelect(item)}
                      className={selectStyles.item}
                    >
                      <Check
                        className={cn(
                          selectStyles.check,
                          selected ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden
                      />
                      <span className="flex min-w-0 items-center gap-2">
                        {renderImage(item)}
                        <span className="truncate">{itemLabel}</span>
                      </span>
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

export { MultiSelect } from "./multi-select";
export type { MultiSelectProps } from "./multi-select";
export type { SelectProps };

// Formik usage (touched first, then the value, so validation sees the new value):
// <Select
//   items={grades}
//   valueKey="_id"
//   labelKey="name"
//   name="grade"
//   value={values.grade}
//   onSelect={(id) => {
//     setFieldTouched("grade", true, false);
//     setFieldValue("grade", id);
//   }}
//   onBlur={() => setFieldTouched("grade", true)}
//   label="Grade"
//   error={errors.grade}
//   touched={touched.grade}
// />
