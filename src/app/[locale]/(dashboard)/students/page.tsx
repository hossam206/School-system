import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import StudentsView from "./_components/StudentsView";

export const generateMetadata = createMetadata(
  "students.Title",
  "students.Description",
);

export default function StudentsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StudentsView />
    </Suspense>
  );
}
