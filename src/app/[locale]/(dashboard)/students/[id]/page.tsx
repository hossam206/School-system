import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import StudentDetailView from "../_components/StudentDetailView";

export const generateMetadata = createMetadata(
  "studentDetail.Title",
  "studentDetail.Description",
);

export default function StudentDetailPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StudentDetailView />
    </Suspense>
  );
}
