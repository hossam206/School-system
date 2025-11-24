"use server";

import { apiFetch } from "@/src/services/apiInstance";

export async function GET_PROJECTS() {
  return apiFetch("/projects", {
    method: "GET",
    next: {
      tags: ["projects"],
    },
  });
}
