"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/src/components/ui/select/dialog";
import Button from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  children?: React.ReactNode;

  footer?: React.ReactNode;

  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  maxWidth?: string;

  // Trigger element for controlled modals
  trigger?: React.ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  showCloseButton = true,
  maxWidth = "sm:max-w-lg",
  trigger,
}: ModalProps) {
  const hasHeader = !!(title || description);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={showCloseButton}
        {...(!description ? { "aria-describedby": undefined } : {})}
        className={cn(
          "gap-0 bg-card text-card-foreground",
          "rounded-xl shadow-xl border border-border",
          maxWidth,
          className
        )}
      >
        {hasHeader ? (
          <DialogHeader className="gap-1.5 px-6 pt-6 pb-4 pe-12">
            {title && (
              <DialogTitle className="text-lg font-semibold text-foreground">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription asChild>
                <div className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
        ) : (
          // Radix requires a title for accessibility; keep an empty hidden one.
          <DialogTitle className="sr-only" />
        )}

        {children && (
          <div
            className={cn(
              "max-h-[70vh] overflow-y-auto scrollbar-modern px-6 pb-6",
              !hasHeader && "pt-6",
              contentClassName
            )}
          >
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter className="gap-2 border-t border-border bg-muted/40 px-6 py-4 sm:gap-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Confirmation Modal Variant
export interface ConfirmModalProps extends Omit<ModalProps, "footer"> {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "success";
  isLoading?: boolean;
}

const confirmButtonVariant = {
  default: "btn-primary",
  destructive: "btn-delete",
  success: "success",
} as const;

export function ConfirmModal({
  title,
  description,
  confirmText,
  cancelText,
  confirmVariant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
  onOpenChange,
  ...props
}: ConfirmModalProps) {
  const t = useTranslations("common");

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const footer = (
    <>
      <Button variant="btn-cancel" onClick={handleCancel} disabled={isLoading}>
        {cancelText ?? t("cancel")}
      </Button>
      <Button
        variant={confirmButtonVariant[confirmVariant]}
        onClick={onConfirm}
        loading={isLoading}
      >
        {confirmText ??
          (confirmVariant === "destructive" ? t("deleteAction") : t("save"))}
      </Button>
    </>
  );

  return (
    <Modal
      title={title ?? t("confirmDeleteTitle")}
      description={description ?? t("confirmDeleteDescription")}
      footer={footer}
      onOpenChange={(next) => {
        // Block closing (Esc / overlay / X) while the confirm action is running
        if (!next && isLoading) return;
        onOpenChange?.(next);
      }}
      maxWidth="sm:max-w-md"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
