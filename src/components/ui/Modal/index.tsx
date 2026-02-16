"use client";

import * as React from "react";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "bg-white dark:bg-gray-900",
          "rounded-2xl shadow-2xl",
          "border border-gray-200 dark:border-gray-800",
          "transition-all duration-200",
          maxWidth,
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="space-y-3">
            {title && (
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {children && (
          <div className={cn("px-6 py-4", contentClassName)}>
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter className="gap-3 sm:gap-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Confirmation Modal Variant
export interface ConfirmModalProps extends Omit<ModalProps, 'footer'> {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'success';
  isLoading?: boolean;
}

export function ConfirmModal({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirmText = "Continue",
  cancelText = "Cancel",
  confirmVariant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
  ...props
}: ConfirmModalProps) {
  const confirmStyles = {
    default: "bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  const footer = (
    <>
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          confirmStyles[confirmVariant]
        )}
      >
        {isLoading ? "Loading..." : confirmText}
      </button>
    </>
  );

  return (
    <Modal
      title={title}
      description={description}
      footer={footer}
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
