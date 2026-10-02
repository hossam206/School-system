"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { revokeSession } from "@/src/services/sessions";
import type { Session } from "@/src/types/auth";
import { toastError } from "@/src/utils/toastError";

type RevokeSessionDialogProps = {
  /** Kept by the caller after closing so the text doesn't change during the close animation. */
  session: Session | null;
  deviceLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
};

export function RevokeSessionDialog({
  session,
  deviceLabel,
  open,
  onOpenChange,
  onDone,
}: RevokeSessionDialogProps) {
  const t = useTranslations("sessions");
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    if (!session) return;
    setPending(true);
    try {
      const { message } = await revokeSession(session._id);
      toast.success(message);
    } catch (error) {
      toastError(error);
    }
    setPending(false);
    onOpenChange(false);
    onDone();
  };

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      confirmVariant="destructive"
      title={t("revokeTitle")}
      description={t("revokeDescription", { device: deviceLabel })}
      confirmText={t("revoke")}
      isLoading={pending}
      onConfirm={handleConfirm}
    />
  );
}
