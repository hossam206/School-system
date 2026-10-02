import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import TeachersView from "./_components/TeachersView";

export const generateMetadata = createMetadata(
  "teachers.Title",
  "teachers.Description",
);

export default function TeachersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TeachersView />
    </Suspense>
  );
}
