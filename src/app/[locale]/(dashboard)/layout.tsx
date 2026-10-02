import { Suspense } from "react";
import { Sidebar } from "@/src/components/ui/sidebar";
import { SidebarSkeleton } from "@/src/components/helpers/SidebarSkeleton";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { AuthGuard } from "./_components/AuthGuard";

function DashboardShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebar}
      <main className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // until the session is confirmed, show the same skeletons as a loading page
  const skeleton = (
    <DashboardShell sidebar={<SidebarSkeleton />}>
      <PageSkeleton />
    </DashboardShell>
  );

  return (
    // the guard can't decide on the server, so the prerendered shell is the skeleton
    <Suspense fallback={skeleton}>
      <AuthGuard fallback={skeleton}>
        <DashboardShell
          sidebar={
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar />
            </Suspense>
          }
        >
          {children}
        </DashboardShell>
      </AuthGuard>
    </Suspense>
  );
}
