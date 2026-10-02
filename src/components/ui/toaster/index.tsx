"use client";

import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { toasterStyles } from "./classNames";

type ToasterProps = Omit<React.ComponentProps<typeof Sonner>, "theme"> & {
  status?: "success" | "error";
  description?: string;
};

const Toaster = ({ status, description, style, ...props }: ToasterProps) => {
  useEffect(() => {
    if (!status || !description?.trim()) return;

    if (status === "success") {
      toast.success(description, {
        icon: <CheckCircle2 className="size-5 text-success" />,
      });
    } else {
      toast.error(description, {
        icon: <XCircle className="size-5 text-destructive" />,
      });
    }
  }, [status, description]);

  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-card)",
          "--normal-text": "var(--color-card-foreground)",
          "--normal-border": "var(--color-border)",
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: toasterStyles.toastContainerStyles,
          description: toasterStyles.description,
          success: toasterStyles.success,
          error: toasterStyles.error,
          warning: toasterStyles.warning,
          info: toasterStyles.info,
          actionButton: toasterStyles.actionButton,
          cancelButton: toasterStyles.cancelButton,
        },
      }}
      {...props}
    />
  );
};

export default Toaster;
export { Toaster };
export type { ToasterProps };
