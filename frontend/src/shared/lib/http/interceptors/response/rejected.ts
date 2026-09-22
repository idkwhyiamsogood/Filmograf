import type { AxiosError } from "axios";
import type { APIError } from "@/shared/types";
import { deleteCookie } from "cookies-next";
import { errorService } from "@/shared/services";
import { toast } from "sonner";

export const onRejected = (error: AxiosError<APIError>) => {
  if (error.response?.status === 401) {
    deleteCookie("access_token");
  }

  // Запрос ушёл, но ответа от сервера так и не пришло (сеть недоступна,
  // таймаут, обрыв соединения) — тут нет response.data, показать нечего
  // через модалки ERROR_HANDLERS, поэтому просто уведомляем тостом.
  // id фиксированный, чтобы при обвале сразу нескольких запросов не
  // штамповались одинаковые тосты друг на друга.
  if (!error.response) {
    toast.error("Нет ответа от сервера. Проверьте подключение к интернету.", {
      id: "network-error",
    });
    return Promise.reject(error);
  }
  
  if (error.response?.data) {
    errorService.showError(error.response.data);
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
