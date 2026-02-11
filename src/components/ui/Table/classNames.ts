import clx from "clsx";

// Action menu trigger styles
export const actionTriggerStyles = clx(
  "inline-flex items-center justify-center rounded-md p-1.5 cursor-pointer",
  "text-gray-60 hover:bg-gray-10 hover:text-gray-90 transition-colors",
  "outline-none"
);

// Action menu item base styles
export const actionItemBaseStyles = clx(
  "w-full text-start px-3 py-2 text-sm cursor-pointer rounded-md",
  "transition-colors duration-150 outline-none"
);

// Action menu item variant styles
export const actionVariantStyles = {
  primary: clx("text-darkgreen hover:bg-green-50"),
  destructive: clx("text-[#C1342E] hover:bg-[#FFE4DE]"),
  secondary: clx("text-gray-70 hover:bg-gray-10"),
  default: clx("text-gray-70 hover:bg-gray-10"),
};
