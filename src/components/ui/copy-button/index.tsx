"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
};

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for insecure contexts (http on a LAN address)
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Copy failed");
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const t = useTranslations("common");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Never trigger a parent row click
    event.stopPropagation();
    event.preventDefault();
    try {
      await copyText(value);
      setCopied(true);
      toast.success(t("copied"));
    } catch {
      // Clipboard unavailable: nothing to do, the value stays selectable
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-mono text-xs text-foreground select-all">
        {value}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("copy")}
        title={t("copy")}
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground",
          "transition-colors hover:bg-muted hover:text-foreground outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        {copied ? (
          <Check className="size-3.5 text-success" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>
    </span>
  );
}

export type { CopyButtonProps };
