import { handleResponse } from "@/src/utils/handleResponse";

export const getData = async <T = any>(endPoint: string): Promise<T> => {
  const fetchOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const base =
    typeof window === "undefined"
      ? process.env.BASE_URL ||
        (process.env.BASE_URL
          ? `https://${process.env.BASE_URL}`
          : "http://localhost:3000")
      : "";
  const response = await fetch(`${base}/${endPoint}`, fetchOptions);
  console.log('response is',response)
  return handleResponse(response);
};
