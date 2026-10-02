import { getJson, postJson } from "@/src/services/api";
import type { ApiResponse, Session } from "@/src/types/auth";

// the signed-in user's sessions that are neither revoked nor expired, newest first
export const getActiveSessions = async () =>
  (await getJson<ApiResponse<{ data: Session[] }>>("/sessions/active")).data;

// the device behind that session gets a 401 on its next request, including its refresh
export const revokeSession = (sessionId: string) =>
  postJson<ApiResponse<{ data: Session }>>("/sessions/revoke", { sessionId });
