import React, { ReactNode, forwardRef } from "react";
import { getButtonStyles, variantStyles } from "./classNames";
import { ImSpinner8 } from "react-icons/im";
import { IoCheckmark } from "react-icons/io5";
import { MdOutlineSmsFailed } from "react-icons/md";

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: keyof typeof variantStyles;
  disabled?: boolean;
  submitStatus?: "loading" | "success" | "error" | "idle";
  ariaLabel?: string;
  name?: string;
  size?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      name = "",
      className = "",
      type = "button",
      disabled = false,
      variant,
      submitStatus = "idle",
      ariaLabel,
      prefix,
      suffix,
    },
    ref
  ) => {
    const combinedStyles = getButtonStyles(className, variant, submitStatus);

    const renderStatus = () => {
      switch (submitStatus) {
        case "loading":
          return (
            <span className="flex items-center gap-2">
              <ImSpinner8 size={18} className="animate-spin" />
              Loading...
            </span>
          );
        case "success":
          return (
            <span className="flex items-center gap-1">
              <IoCheckmark size={18} />
              Success
            </span>
          );
        case "error":
          return (
            <span className="flex items-center gap-2">
              <MdOutlineSmsFailed size={18} />
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
        name={name}
        className={combinedStyles}
        onClick={onClick}
        disabled={disabled || submitStatus === "loading"}
        aria-disabled={disabled || submitStatus === "loading"}
        aria-label={ariaLabel}
        ref={ref}
      >
        {submitStatus !== "idle" ? renderStatus() : renderIdleContent()}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
