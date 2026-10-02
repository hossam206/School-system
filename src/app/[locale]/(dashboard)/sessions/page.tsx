import { Suspense } from "react";
import { PageSkeleton } from "@/src/components/helpers/PageSkeleton";
import { createMetadata } from "@/src/utils/generateMetadata";
import SessionsView from "./_components/SessionsView";

export const generateMetadata = createMetadata(
  "sessions.Title",
  "sessions.Description",
);

export default function SessionsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SessionsView />
    </Suspense>
  );
}
