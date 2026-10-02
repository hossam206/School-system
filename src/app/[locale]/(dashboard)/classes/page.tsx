import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import ClassesView from "./_components/ClassesView";

export const generateMetadata = createMetadata(
  "classes.Title",
  "classes.Description",
);

export default function ClassesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ClassesView />
    </Suspense>
  );
}
