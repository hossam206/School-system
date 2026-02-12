"use client";

import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Bell,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Users", href: "/users", icon: <Users className="h-5 w-5" /> },
  { label: "Reports", href: "/reports", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Documents", href: "/documents", icon: <FileText className="h-5 w-5" /> },
  { label: "Notifications", href: "/notifications", icon: <Bell className="h-5 w-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Strip locale prefix (e.g. /en/users -> /users)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[250px]",
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <span className="text-base font-semibold text-foreground truncate">
            Dashboard
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-1.5",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "transition-colors cursor-pointer",
            collapsed && "mx-auto",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-modern">
        {navItems.map((item) => {
          const isActive = pathWithoutLocale === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
            "text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
