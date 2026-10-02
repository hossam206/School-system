"use client";

import * as React from "react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MonitorSmartphone,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  School,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";
import { SidebarAccount } from "./SidebarAccount";

type NavKey =
  | "dashboard"
  | "grades"
  | "subjects"
  | "classes"
  | "teachers"
  | "students"
  | "sessions";

type NavItem = {
  key: NavKey;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "grades", href: "/grades", icon: GraduationCap },
  { key: "subjects", href: "/subjects", icon: BookOpen },
  { key: "classes", href: "/classes", icon: School },
  { key: "teachers", href: "/teachers", icon: Presentation },
  { key: "students", href: "/students", icon: Users },
  { key: "sessions", href: "/sessions", icon: MonitorSmartphone },
];

const DESKTOP_QUERY = "(min-width: 768px)";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// "auto" follows the breakpoint (rail below md, expanded at md+) until the
// viewport is known or the user toggles the sidebar.
type Mode = "auto" | "collapsed" | "expanded";

const modeStyles: Record<
  Mode,
  { aside: string; label: string; link: string; brand: string }
> = {
  auto: {
    aside: "w-[68px] md:w-64",
    label: "hidden md:inline",
    link: "justify-center px-0 md:justify-start md:px-3",
    brand: "justify-center px-0 md:justify-start md:px-4",
  },
  collapsed: {
    aside: "w-[68px]",
    label: "hidden",
    link: "justify-center px-0",
    brand: "justify-center px-0",
  },
  expanded: {
    aside: "w-64",
    label: "inline",
    link: "justify-start px-3",
    brand: "justify-start px-4",
  },
};

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const effectiveCollapsed =
    collapsed ?? (isDesktop === null ? null : !isDesktop);
  const mode: Mode =
    effectiveCollapsed === null
      ? "auto"
      : effectiveCollapsed
        ? "collapsed"
        : "expanded";
  const styles = modeStyles[mode];
  const toggleLabel = effectiveCollapsed ? t("expand") : t("collapse");

  const handleToggle = () => {
    const current =
      effectiveCollapsed ?? !window.matchMedia(DESKTOP_QUERY).matches;
    setCollapsed(!current);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-e border-border bg-card",
        "transition-[width] duration-200 ease-in-out",
        styles.aside
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 border-b border-border",
          styles.brand
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <GraduationCap className="size-4" aria-hidden />
        </span>
        <span
          className={cn(
            "truncate text-sm font-semibold tracking-tight text-foreground",
            styles.label
          )}
        >
          {t("appName")}
        </span>
      </div>

      {/* Navigation */}
      <nav
        aria-label={t("appName")}
        className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-modern"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = t(item.key);
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={mode === "expanded" ? undefined : label}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md text-sm font-medium transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring/40",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                styles.link
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className={cn("truncate", styles.label)}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Signed-in user, log out and collapse toggle */}
      <div className="space-y-1 border-t border-border p-3">
        <SidebarAccount
          labelClassName={styles.label}
          itemClassName={styles.link}
          showTitles={mode !== "expanded"}
        />
        <button
          type="button"
          onClick={handleToggle}
          aria-label={toggleLabel}
          aria-expanded={effectiveCollapsed === null ? undefined : !effectiveCollapsed}
          title={toggleLabel}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-md text-sm font-medium text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground outline-none cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-ring/40",
            styles.link
          )}
        >
          {mode === "auto" ? (
            <>
              <PanelLeftOpen
                className="size-5 shrink-0 rtl:-scale-x-100 md:hidden"
                aria-hidden
              />
              <PanelLeftClose
                className="hidden size-5 shrink-0 rtl:-scale-x-100 md:block"
                aria-hidden
              />
            </>
          ) : effectiveCollapsed ? (
            <PanelLeftOpen className="size-5 shrink-0 rtl:rotate-180" aria-hidden />
          ) : (
            <PanelLeftClose className="size-5 shrink-0 rtl:rotate-180" aria-hidden />
          )}
          <span className={cn("truncate", styles.label)}>{t("collapse")}</span>
        </button>
      </div>
    </aside>
  );
}
