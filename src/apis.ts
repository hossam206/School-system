"use server";

import { apiFetch } from "@/src/lib/apiInstance";

export async function GET_PROJECTS() {
  return apiFetch("/projects", {
    method: "GET",
    next: {
      tags: ["projects"],
    },
  });
}
