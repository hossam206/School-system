import React, { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
import { getButtonStyles, variantStyles } from "./classNames";

import { Loader, Check, AlertCircle } from "lucide-react";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  variant?: keyof typeof variantStyles;
  submitStatus?: "loading" | "success" | "error" | "idle";
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      type = "button",
      disabled = false,
      variant,
      submitStatus = "idle",
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const combinedStyles = getButtonStyles(className, variant, submitStatus);

    const renderStatus = () => {
      switch (submitStatus) {
        case "loading":
          return (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin" />
              Loading...
            </span>
          );
        case "success":
          return (
            <span className="flex items-center gap-1">
              <Check size={18} />
              Success
            </span>
          );
        case "error":
          return (
            <span className="flex items-center gap-2">
              <AlertCircle size={18} />
              Failed
            </span>
          );
        default:
          return null;
      }
    };

    const renderIdleContent = () => (
      <span className="flex items-center gap-2">
        {prefix}
        {children}
        {suffix}
      </span>
    );

    return (
      <button
        type={type}
        className={combinedStyles}
        disabled={disabled || submitStatus === "loading"}
        aria-disabled={disabled || submitStatus === "loading"}
        ref={ref}
        {...props}
      >
        {submitStatus !== "idle" ? renderStatus() : renderIdleContent()}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
