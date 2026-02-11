export const handleResponse = async (response: Response) => {
 if (response.status === 401) {
    window.history.pushState({}, "", window.location.pathname + "/?unauthorized=true");
    console.log("401 unathorized");
    return;
  }

  // Handle other errors
  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    return {
      success: false,
      message: errorJson?.message || "Something went wrong",
      status: response.status,
    };
  }

  const result = await response.json();
  return result;
}