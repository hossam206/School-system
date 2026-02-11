import { handleResponse } from "@/src/utils/handleResponse";

export const postData = async <T = any>(
  endPoint: string,
  payload: FormData | T
) => {
  const isFormData = payload instanceof FormData;
  const fetchOptions: RequestInit = {            
    method: "POST",
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: "include",
    cache: "no-store",
  };

  if (!isFormData) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
  }
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")
      : "";

  const response = await fetch(`${base}/${endPoint}`, fetchOptions);
  return handleResponse(response);
};
