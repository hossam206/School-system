import React, { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
import { getButtonStyles, variantStyles } from "./classNames";

import { Loader } from "lucide-react";
import { generalStore } from "@/src/store/generalStore";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  variant?: keyof typeof variantStyles;
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

    console.log(loadingKey, "loadingKey");
    console.log(globalLoadingKey, "globalLoadingKey");

    const combinedStyles = getButtonStyles(
      className,
      variant,
      isLoading,
      disabled
    );

    const renderLoading = () => (
      <span className="flex items-center gap-2">
        <Loader size={18} className="animate-spin" />
        Loading...
      </span>
    );

    const renderContent = () => (
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
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? renderLoading() : renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
