import { apiFetch } from "@/src/services/apiInstance";
import { generalStore } from "@/src/store/generalStore";
import { handleResponse } from "./services/handleResponse";

export async function GET_PROJECTS() {
  generalStore.getState().updateGeneral({ loadingKey: "projects" });
  const response = await apiFetch("/projects", {
    method: "GET",
    next: {
      tags: ["projects"],
      revalidate: 60,
    },
  });

  return handleResponse({ response });
}
