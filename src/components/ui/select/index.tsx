"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import Button from "../Button";

interface GenericSelectProps<T> {
  items: T[];
  valueKey?: keyof T;
  labelKey?: keyof T;
  imageKey?: keyof T;
  onSelect: (value: any) => void;
  placeholder?: string;
  title?: string;
  defaultValue?: any;
  className?: string;
}

export function GenericSelect<T extends Record<string, any>>({
  items,
  valueKey = "value",
  labelKey = "label",
  imageKey,
  onSelect,
  placeholder = "Select item...",
  title = "Select item",
  defaultValue,
  className,
}: GenericSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const selectedItem = items.find((item) => item[valueKey] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
           aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? (
            <div className="flex items-center gap-2">
              {imageKey && selectedItem[imageKey] && (
                <img
                  src={selectedItem[imageKey]}
                  alt={selectedItem[labelKey]}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              {selectedItem[labelKey]}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const isSelected = value === item[valueKey];
                return (
                  <CommandItem
                    key={String(item[valueKey])}
                    value={String(item[labelKey])} // Command uses value for filtering, usually label is better for search
                    onSelect={() => {
                      const newValue = item[valueKey];
                      setValue(newValue === value ? "" : newValue);
                      onSelect(newValue === value ? "" : newValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {imageKey && item[imageKey] && (
                        <img
                          src={item[imageKey]}
                          alt={item[labelKey]}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      )}
                      {item[labelKey]}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


// usage
      // <GenericSelect
      //   items={users}
      //   valueKey="id" // send this param if want to select by id instead of value
      //   labelKey="name" // send this param if want to display by name instead of value
      //   imageKey="avatar" // send this param if want to display image
      //   onSelect={(id) => console.log("Selected ID:", id)}
      //   placeholder="Select User"
      // />;