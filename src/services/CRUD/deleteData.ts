export async function deleteData<T = any>(
  endPoint: string
): Promise<T> {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")
      : "";

  const response = await fetch(`${base}/${endPoint}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    const error = new Error("UNAUTHORIZED");
    (error as any).status = 401;
    throw error;
  }

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const error = new Error(errorJson?.message || "Request failed");
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
