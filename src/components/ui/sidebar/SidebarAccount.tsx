"use client";

import * as React from "react";
import { Loader, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { cn } from "@/src/lib/utils";
import { endSession } from "@/src/services/api";
import { logout } from "@/src/services/auth";
import { userStore } from "@/src/store/userStore";

type SidebarAccountProps = {
  // the sidebar's collapse-aware classes, so this follows the rail/expanded mode
  labelClassName: string;
  itemClassName: string;
  // native tooltips stand in for the hidden labels when collapsed
  showTitles: boolean;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SidebarAccount({
  labelClassName,
  itemClassName,
  showTitles,
}: SidebarAccountProps) {
  const t = useTranslations("nav");
  const ta = useTranslations("auth");
  const { user } = useAuth();
  const [pending, setPending] = React.useState(false);

  if (!user) return null;

  const role = ta(`roles.${user.role}`);
  const logoutLabel = pending ? t("loggingOut") : t("logout");

  // the dashboard layout redirects to login once the user is cleared
  const handleLogout = async () => {
    setPending(true);
    try {
      // the API clears both cookies itself
      const { message } = await logout();
      toast.success(message);
      userStore.getState().clearUser();
    } catch {
      // No error toast: the user asked to log out and is logged out either way.
      // A 401 has already ended the session; if the API is down, clear the cookies here instead.
      await endSession();
    }
  };

  return (
    <>
      <div
        title={showTitles ? `${user.userName} · ${role}` : undefined}
        className={cn("flex h-12 items-center gap-3 rounded-md", itemClassName)}
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
        >
          {initials(user.userName)}
        </span>
        <span className={cn("min-w-0 leading-tight", labelClassName)}>
          <span className="block truncate text-sm font-medium text-foreground">
            {user.userName}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {role}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        aria-label={showTitles ? logoutLabel : undefined}
        title={showTitles ? logoutLabel : undefined}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-md text-sm font-medium text-muted-foreground",
          "transition-colors hover:bg-destructive/10 hover:text-destructive outline-none cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60",
          itemClassName
        )}
      >
        {pending ? (
          <Loader className="size-5 shrink-0 animate-spin" aria-hidden />
        ) : (
          <LogOut className="size-5 shrink-0 rtl:rotate-180" aria-hidden />
        )}
        <span className={cn("truncate", labelClassName)}>{logoutLabel}</span>
      </button>
    </>
  );
}
