"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react"; 
import { toasterStyles } from "./classNames";

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  status?: "success" | "error";
  description?: string;
  theme?: "system" | "dark" | "light";
};

const Toaster = ({ status, description, ...props }: ToasterProps) => {
  const { theme } = useTheme();

  const validTheme = (
    ["system", "dark", "light"].includes(theme || "") ? theme : "system"
  ) as "system" | "dark" | "light";

  useEffect(() => {
    if (!status || !description?.trim()) return;

    const toastOptions = {
      icon:
        status === "success" ? (
          <CheckCircle size={24} className="text-green-40" />
        ) : (
          <XCircle size={24} className="text-red-700" />
        ),
    };

    if (status === "success") {
      toast.success(description, toastOptions);
    } else {
      toast.error(description, toastOptions);
    }
  }, [status, description]);

  return (
    <Sonner
      theme={validTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: toasterStyles.toastContainerStyles,
          description:
            "group-[.toaster]:text-muted-foreground text-sm capitalize",
          success: "!bg-green-10 !border-green-60 !text-green-80",
          error: "!bg-red-100 !border-red-300 !text-red-800",
        },
      }}
      {...props}
    />
  );
};

export default Toaster;
