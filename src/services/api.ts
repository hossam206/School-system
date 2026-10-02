import { userStore } from "@/src/store/userStore";

// Browser-side client for the Express API, reached through the /api/v1 rewrite
// in next.config.ts. The auth tokens travel only in httpOnly cookies.
const API_BASE = "/api/v1";

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

let refreshing: Promise<Response> | null = null;

// Deletes both auth cookies (httpOnly, so only a server response can) and the stored user.
export async function endSession() {
  await fetch("/api/auth/deleteCookie", { method: "POST" }).catch(() => {});
  // the dashboard layout sends the user to login once they are cleared
  userStore.getState().clearUser();
}

// Sends the auth cookies with every call. A 401 outside /auth/* may only mean
// the 15-minute access token expired, so it gets one refresh and one retry.
// Any 401 still left after that ends the session.
export async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const send = () =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

  let res = await send();

  if (res.status === 401 && !path.startsWith("/auth/")) {
    // share one refresh between requests that fail at the same moment
    refreshing ??= fetch(`${API_BASE}/auth/refreshToken`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      refreshing = null;
    });

    if ((await refreshing).ok) res = await send();
  }

  if (res.status === 401) await endSession();
  return res;
}

// Returns the parsed JSON body, or throws an ApiError carrying the API's message
async function requestJson<T>(path: string, options: RequestInit): Promise<T> {
  const res = await api(path, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      res.status < 500 && typeof data?.message === "string"
        ? data.message
        : "Something went wrong, please try again.";
    throw new ApiError(
      res.status,
      message,
      Array.isArray(data?.errors) ? data.errors : []
    );
  }

  return data as T;
}

export const getJson = <T>(path: string) =>
  requestJson<T>(path, { method: "GET" });

export const postJson = <T>(path: string, body?: unknown) =>
  requestJson<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
