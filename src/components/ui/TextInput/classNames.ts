import clx from "clsx";
export const TextInputStyles = {
  labelStyle: clx(
    "flex flex-row items-center gap-1 text-sm font-medium text-foreground"
  ),
  inputStyle: clx(
    "flex h-9 w-full rounded-md border border-solid border-input bg-card px-3 text-sm text-foreground shadow-xs",
    "transition-[color,box-shadow,border-color] outline-none",
    "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-muted has-[:disabled]:opacity-50",
    "[&_input::placeholder]:text-muted-foreground"
  ),
  requiredInputStyle: clx(
    "border-destructive focus-within:border-destructive focus-within:ring-destructive/30"
  ),
  requiredMark: clx("text-destructive"),
  errorMsg: clx("text-xs text-destructive"),
  showPassword: clx(
    "flex items-center cursor-pointer text-muted-foreground hover:text-foreground [&_svg]:size-4"
  ),
};
export const getAditionalStyles = (className?: string) => {
  return clx(TextInputStyles.inputStyle, className);
};
