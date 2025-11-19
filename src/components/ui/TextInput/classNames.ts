import clx from "clsx";
export const TextInputStyles = {
  labelStyle: clx(
    "flex flex-row items-center  gap-1 text-sm font-semibold text-gray-60 "
  ),
  inputStyle: clx(
    "flex   rounded-lg border border-solid  bg-transparent px-3  py-2 text-base   transition-colors  disabled:cursor-not-allowed disabled:opacity-50 md:text-md md:leading-6 outline-none   placeholder:font-light placeholder:text-sm outline-none"
  ),
  // labelStyle: clx("flex flex-row items-center  gap-1 text-sm font-medium text-gray-40"),
  requiredInputStyle: clx(
    "border-red-500 focus:ring-red-500",
    "border-gray-300 focus:border-slate-700"
  ),
  errorMsg: clx("text-red-500 text-xs mt-1 "),
  showPassword: clx(
    "absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer text-xl text-gray-60"
  ),
};
export const getAditionalStyles = (className?: string) => {
  return clx(TextInputStyles.inputStyle, className);
};
