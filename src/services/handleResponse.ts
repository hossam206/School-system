import { generalStore } from "../store/generalStore";

interface HandleResponseProps {
  response: any;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

// Flag to prevent multiple logout calls
let isLoggingOut = false;

export const handleResponse = async ({
  response,
  showErrorToast = true,
  showSuccessToast = true,
}: HandleResponseProps) => {
  if (typeof window === "undefined") {
    return response;
  }

  //   if (!response.success && showErrorToast) {
  //     setErrorAction({
  //       message: response.message,
  //       status: response.status,
  //       type: "error",
  //       icons: "error",
  //     });
  //   }

  //   if (response.success && showSuccessToast) {
  //     setErrorAction({
  //       message: response.message,
  //       status: response.status,
  //       type: "success",
  //       icons: "success",
  //     });
  //   }

  // Only logout on 401 if it's a clear authentication error and we're not already logging out
  if (response.status === 401 && !isLoggingOut) {
  }

  generalStore.getState().setGeneral({ loadingKey: "" });

  return response;
};
