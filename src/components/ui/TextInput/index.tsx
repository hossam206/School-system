"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getAditionalStyles, TextInputStyles } from "./classNames";
import { Eye, EyeOff } from "lucide-react"; // ← REPLACED HERE
import { HandleError } from "@/src/utils/handleError";

type TextInputProps = {
  label?: string;
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  autocomplete?: string;
  mandatory?: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  touched?: boolean;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
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
  onChange,
  onBlur,
  className = "",
  error,
  touched,
  minLength,
  maxLength,
  pattern,
  autocomplete,
  prefix,
  suffix,
}: TextInputProps) => {
  const combinedStyles = getAditionalStyles(className);
  const [showPassword, setShowPassword] = useState(false);

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

    return <span className="flex items-center">{addon}</span>;
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label && (
        <label htmlFor={id} className={TextInputStyles.labelStyle}>
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center gap-2 ${
          error && touched ? TextInputStyles.requiredInputStyle : ""
        } ${combinedStyles}`}
      >
        {/* Prefix */}
        {renderIcon(prefix)}

        {/* Input */}
        <input
          id={id}
          type={showPassword && type === "password" ? "text" : type}
          placeholder={placeholder}
          value={value || ""}
          readOnly={readOnly}
          name={name}
          onChange={onChange}
          autoComplete={autocomplete}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          {...(type === "number" ? { min: 0 } : {})}
          className="flex-1 bg-transparent outline-none"
        />

        {/* Password Eye Toggle */}
        {type === "password" ? (
          <span
            className={TextInputStyles.showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        ) : (
          renderIcon(suffix)
        )}
      </div>

      {/* Error */}
      {error && touched && <HandleError error={error} />}
    </div>
  );
};

export default TextInput;
