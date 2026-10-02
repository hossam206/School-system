import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import ClassDetailView from "../_components/ClassDetailView";

export const generateMetadata = createMetadata(
  "classDetail.Title",
  "classDetail.Description",
);

export default function ClassDetailPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ClassDetailView />
    </Suspense>
  );
}
