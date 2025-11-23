import clx from "clsx";
export const checkBoxstyles = {
  checkBox: clx(
    "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground font-semibold"
  ),
  checkBoxIndicator: clx("flex items-center justify-center text-current"),
  labelStyle: clx(
    "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-70"
  ),
};
