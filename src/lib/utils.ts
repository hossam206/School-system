// this for chadcn

import { clsx, type ClassValue } from "clsx";
import { ChartNoAxesColumnDecreasing } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
