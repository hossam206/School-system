import clx from "clsx";

// Base button styles
export const baseButtonStyles = clx(
  "flex flex-row items-center justify-center gap-1 text-sm px-2 py-2 rounded-[30px] font-medium transition-all duration-300 ease-in-out hover:opacity-80 active:scale-95 tracking-wide disabled:cursor-not-allowed disabled:opacity-50 outline-none cursor-pointer bg-primary"
);

// Variant styles
export const variantStyles = {
  "btn-primary": clx("bg-darkgreen text-white"),
  "btn-secondary": clx("bg-gray-90 text-white hover:opacity-60 "),
  "btn-delete": clx(
    "bg-[#FFE4DE] text-[#C1342E] hover:bg-[#FFC9BC] hover:text-[#BA241F] transition font-semibold"
  ),
  "btn-cancel": clx(
    "bg-gray-30 text-gray-70 hover:bg-gray-40 border border-solid border-gray-40 font-medium"
  ),
  loading: clx("opacity-50 cursor-not-allowed"),
  success: clx("bg-green-500 text-white"),
  error: clx("bg-red-600 text-white"),
  disabled: false,
  idle: "",
  outline: clx(
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  ),
};

// Get styles based on variant and status
export const getButtonStyles = (
  className?: string,
  variant?: keyof typeof variantStyles,
  submitStatus?: keyof typeof variantStyles,
  disabled?: boolean
) => {
  return clx(
    baseButtonStyles,
    variant && variantStyles[variant],
    submitStatus && variantStyles[submitStatus],
    className,
    disabled
  );
};
