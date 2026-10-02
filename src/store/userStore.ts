import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES, type User } from "@/src/types/auth";

// The tokens live in httpOnly cookies the UI can't read, and the API has no
// GET /auth/me, so the user object from login is kept here across reloads.
type UserState = {
  user: User | null;
  // True once this page load has seen the session cookies work, so the
  // dashboard doesn't re-check a session it just watched being created.
  // Not persisted: every reload starts unverified.
  sessionVerified: boolean;
  // Only login stores a user, so a stored user starts out verified.
  setUser: (user: User) => void;
  clearUser: () => void;
  markSessionVerified: () => void;
};

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      sessionVerified: false,
      setUser: (user) => set({ user, sessionVerified: true }),
      clearUser: () => set({ user: null, sessionVerified: false }),
      markSessionVerified: () => set({ sessionVerified: true }),
    }),
    {
      name: "user", // this will store in localStorage with this name
      partialize: (state) => ({ user: state.user }),
      // drop anything that isn't a user from the API (e.g. an older shape)
      merge: (persisted, current) => {
        const user = (persisted as Partial<UserState> | undefined)?.user;
        const valid =
          typeof user?.userName === "string" && ROLES.includes(user.role);
        return { ...current, user: valid ? user : null };
      },
    }
  )
);

// Follow logins and logouts made in other tabs.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "user" || event.key === null) {
      userStore.persist.rehydrate();
    }
  });
}
