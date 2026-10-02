import clx from "clsx";
export const checkBoxstyles = {
  checkBox: clx(
    "peer size-4 shrink-0 rounded-sm border border-input bg-card shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
  ),
  checkBoxIndicator: clx("flex items-center justify-center text-current"),
  labelStyle: clx(
    "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  ),
};
