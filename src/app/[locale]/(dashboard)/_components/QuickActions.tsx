"use client";

import { School, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { DashboardPanel, linkButtonClass } from "./DashboardPanel";

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");

  return (
    <DashboardPanel
      id="quick-actions"
      title={t("title")}
      description={t("description")}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href="/students?create=1"
          className={linkButtonClass("default", "lg", "w-full min-w-0")}
        >
          <UserPlus aria-hidden />
          <span className="truncate">{t("addStudent")}</span>
        </Link>
        <Link
          href="/classes?create=1"
          className={linkButtonClass("outline", "lg", "w-full min-w-0")}
        >
          <School aria-hidden />
          <span className="truncate">{t("addClass")}</span>
        </Link>
      </div>
    </DashboardPanel>
  );
}
