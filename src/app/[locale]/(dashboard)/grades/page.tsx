import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import GradesView from "./_components/GradesView";

export const generateMetadata = createMetadata(
  "grades.Title",
  "grades.Description",
);

export default function GradesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <GradesView />
    </Suspense>
  );
}
