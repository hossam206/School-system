import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import DashboardView from "./_components/DashboardView";

export const generateMetadata = createMetadata(
  "dashboard.Title",
  "dashboard.Description",
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}
