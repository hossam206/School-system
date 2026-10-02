"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "@/src/i18n/navigation";
import { ApiError } from "@/src/services/api";
import { refreshToken } from "@/src/services/auth";
import { userStore } from "@/src/store/userStore";
import { toastError } from "@/src/utils/toastError";

type AuthGuardProps = {
  children: React.ReactNode;
  // shown until there is a confirmed session
  fallback: React.ReactNode;
};

// Wraps every page that needs login: no stored user means back to login.
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { status } = useAuth();
  const verified = userStore((state) => state.sessionVerified);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]);

  // The auth cookies are session cookies, so they vanish when the browser
  // closes while the stored user stays. Confirm the session once per page
  // load before showing anything protected.
  useEffect(() => {
    if (status !== "authenticated" || verified) return;

    refreshToken().then(
      () => userStore.getState().markSessionVerified(),
      (error) => {
        toastError(error);
        // a 401 has already ended the session in api(); the redirect above follows
        if (error instanceof ApiError && error.status === 401) return;
        // server unreachable: keep the user; API calls will surface the problem
        userStore.getState().markSessionVerified();
      }
    );
  }, [status, verified]);

  if (status !== "authenticated" || !verified) return fallback;
  return children;
}
