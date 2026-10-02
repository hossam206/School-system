"use client";

import React, { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
import { getButtonStyles, type ButtonSize, type ButtonVariant } from "./classNames";

import { Loader } from "lucide-react";
import { generalStore } from "@/src/store/generalStore";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  loadingKey?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      type = "button",
      disabled = false,
      variant,
      size = "md",
      loading = false,
      prefix,
      suffix,
      loadingKey,
      ...props
    },
    ref
  ) => {
    // get the loading key from the global store
    const globalLoadingKey = generalStore((state) => state.general?.loadingKey);
    // check if the loading key is the same as the button's loading key
    const isGlobalLoading = !!loadingKey && globalLoadingKey === loadingKey;
    // combine local and global loading state
    const isLoading = loading || isGlobalLoading;

    const combinedStyles = getButtonStyles(
      className,
      variant,
      isLoading,
      disabled,
      size
    );

    return (
      <button
        type={type}
        className={combinedStyles}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Loader className="size-4 animate-spin" aria-hidden />
        ) : (
          prefix
        )}
        {children}
        {suffix}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
export { Button };
export type { ButtonProps, ButtonSize, ButtonVariant };
