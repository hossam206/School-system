"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { GraduationCap, Loader } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "@/src/i18n/navigation";

// Login and register are for signed-out visitors. Once a user is stored
// (including right after login) they are sent to the dashboard.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 py-12">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <GraduationCap className="size-5" aria-hidden />
        </span>
        <span className="text-base font-semibold tracking-tight text-foreground">
          {t("appName")}
        </span>
      </div>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
        {user ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <Loader className="size-6 animate-spin text-muted-foreground" aria-hidden />
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
