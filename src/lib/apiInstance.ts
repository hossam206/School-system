"use server";

import { cookies } from "next/headers";

// ----------------------
// Helper to normalize headers
// ----------------------
function normalizeHeaders(h?: HeadersInit): Record<string, string> {
  if (!h) return {};

  // Check for Headers by presence of .entries() method
  if (h && typeof (h as any).entries === "function") {
    return Object.fromEntries((h as Headers).entries());
  }

  // Array of [key, value] tuples
  if (Array.isArray(h)) return Object.fromEntries(h);

  // Plain object
  return h as Record<string, string>;
}

// ----------------------
// Helper to detect plain objects for automatic JSON stringify
// ----------------------
function isPlainObject(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.prototype.toString.call(obj) !== "[object FormData]" &&
    Object.prototype.toString.call(obj) !== "[object ArrayBuffer]"
  );
}

// ----------------------
// Server-side fetch wrapper
// ----------------------
export async function apiFetch(
  url: string,
  options: RequestInit & { includeAuth?: boolean } = {}
) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;
  const fullUrl = baseURL + url;

  const includeAuth = options.includeAuth !== false;

  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...normalizeHeaders(options.headers),
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const lang = cookieStore.get("lang")?.value || "ar";

  if (includeAuth && token) headers["Authorization"] = `Bearer ${token}`;
  headers["Accept-Language"] = lang;

  // Automatically stringify plain object bodies
  let body: string | undefined = options.body as any;
  if (body && isPlainObject(body)) {
    body = JSON.stringify(body);
  }

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
      body,
      // cache: "no-store",
    });

    if (res.status === 401) {
      cookieStore.delete("token");
      throw {
        unauthorized: true,
        redirect: "/",
        message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى",
      };
    }

    return await handleResponse(res);
  } catch (err: any) {
    // Retry on SSL/TLS errors (once)
    if (
      err?.code === "ECONNRESET" ||
      err?.message?.includes("SSL") ||
      err?.message?.includes("TLS")
    ) {
      return fetch(fullUrl, {
        ...options,
        headers,
        body,
        cache: "no-store",
      });
    }
    throw err;
  }
}

// ----------------------
// Response handler
// ----------------------
async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const body = contentType?.includes("json")
      ? await res.json()
      : await res.text();
    throw { status: res.status, body };
  }

  return contentType?.includes("json") ? await res.json() : await res.text();
}
