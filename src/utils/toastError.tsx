import { toast } from "sonner";
import { ApiError } from "@/src/services/api";

// Shows the API's error message. Validation errors (400) come back as a flat
// list with no field names, so the list goes under the message as-is.
export function toastError(error: unknown) {
  const message =
    error instanceof ApiError
      ? error.message
      : "Can't reach the server. Check your connection and try again.";
  const items = error instanceof ApiError ? error.errors : [];

  toast.error(message, {
    // the same message twice (e.g. a dev-mode double effect) updates one toast instead of stacking
    id: message,
    description:
      items.length > 0 ? (
        <ul className="list-disc ps-4">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : undefined,
  });
}
