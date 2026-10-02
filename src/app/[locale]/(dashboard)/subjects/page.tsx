import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import SubjectsView from "./_components/SubjectsView";

export const generateMetadata = createMetadata(
  "subjects.Title",
  "subjects.Description",
);

export default function SubjectsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SubjectsView />
    </Suspense>
  );
}
