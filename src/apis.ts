"use server";

import { apiFetch } from "@/src/lib/apiInstance";

// ----------------------
// Single server action
// ----------------------
export async function GET_PROJECTS() {
  return apiFetch("/projects", {
    method: "GET",
  });
}
