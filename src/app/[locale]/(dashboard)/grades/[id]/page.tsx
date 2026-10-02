import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import GradeDetailView from "../_components/GradeDetailView";

export const generateMetadata = createMetadata(
  "gradeDetail.Title",
  "gradeDetail.Description",
);

export default function GradeDetailPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <GradeDetailView />
    </Suspense>
  );
}
