import type { AxiosError } from "axios";
import type { APIError } from "@/shared/types";
import { deleteCookie } from "cookies-next";
import { errorService } from "@/shared/services";

export const onRejected = (error: AxiosError<APIError>) => {
  if (error.response?.status === 401) {
    deleteCookie("access_token");
  }

  if (error.response?.data) {
    errorService.showError(error.response.data);
    console.log('qwe')
  } else {
    errorService.showError({
      statusCode: error.response?.status || 500,
      message: error.message || "Unknown error",
      code: "UNKNOWN_ERROR",
      data: null,
    });
  }

  return Promise.reject(error);
};
