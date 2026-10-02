"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getAditionalStyles, TextInputStyles } from "./classNames";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

type TextInputProps = {
  label?: string;
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  autocomplete?: string;
  mandatory?: boolean;
  /** Formik value; `0` is shown, `null`/`undefined` render as empty. */
  value?: string | number | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  touched?: boolean;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
};

const TextInput = ({
  label,
  id,
  type = "text",
  placeholder,
  mandatory = false,
  value,
  name,
  readOnly,
  disabled,
  onChange,
  onBlur,
  className = "",
  error,
  touched,
  minLength,
  maxLength,
  min,
  max,
  step,
  pattern,
  autocomplete,
  prefix,
  suffix,
}: TextInputProps) => {
  const combinedStyles = getAditionalStyles(className);
  const [showPassword, setShowPassword] = useState(false);
  // `id` defaults to `name` so the label is always associated with the input
  const inputId = id ?? name;
  const hasError = !!error && !!touched;
  const errorId = `${inputId}-error`;

  const renderIcon = (addon: string | React.ReactNode) => {
    if (!addon) return null;

    // If addon is a string and looks like an image path / render Image
    if (typeof addon === "string" && addon.startsWith("/")) {
      return (
        <Image
          src={addon}
          alt="icon"
          width={20}
          height={20}
          className="object-contain"
        />
      );
    }

    return (
      <span className="flex items-center text-muted-foreground">{addon}</span>
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={TextInputStyles.labelStyle}>
          {label}{" "}
          {mandatory && <span className={TextInputStyles.requiredMark}>*</span>}
        </label>
      )}

      <div
        className={cn(
          "flex items-center gap-2",
          combinedStyles,
          hasError && TextInputStyles.requiredInputStyle
        )}
      >
        {/* Prefix */}
        {renderIcon(prefix)}

        {/* Input */}
        <input
          id={inputId}
          type={showPassword && type === "password" ? "text" : type}
          placeholder={placeholder}
          value={value ?? ""}
          readOnly={readOnly}
          disabled={disabled}
          name={name}
          onChange={onChange}
          autoComplete={autocomplete}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
        />

        {/* Password Eye Toggle */}
        {type === "password" ? (
          <button
            type="button"
            className={TextInputStyles.showPassword}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        ) : (
          renderIcon(suffix)
        )}
      </div>

      {/* Error */}
      {hasError && (
        <p id={errorId} className={TextInputStyles.errorMsg}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
export { TextInput };
