"use client";

import { useSyncExternalStore } from "react";
import { userStore } from "@/src/store/userStore";
import type { User } from "@/src/types/auth";

export type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated"; user: null };

const subscribeNever = () => () => {};

export function useAuth(): AuthState {
  // The stored user only exists in the browser, so the server render and
  // hydration see "loading"; this flips to true right after hydration.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
  const user = userStore((state) => state.user);

  if (!hydrated) return { status: "loading", user: null };
  return user
    ? { status: "authenticated", user }
    : { status: "unauthenticated", user: null };
}
