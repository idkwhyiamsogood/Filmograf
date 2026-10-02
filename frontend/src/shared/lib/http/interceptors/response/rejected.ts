import type { AxiosError } from "axios";
import type { APIError } from "@/shared/types";
import { errorService } from "@/shared/services";
import { toast } from "sonner";

/** Слушает AuthProvider: обновляет токен или переводит сессию в гостевую. */
export const UNAUTHORIZED_EVENT = "filmograf:unauthorized";

export const onRejected = (error: AxiosError<APIError>) => {
  const status = error.response?.status;
  const url = error.config?.url ?? "";

  // 401 — токен протух или его нет. Это не повод пугать пользователя
  // модалкой: сессию восстанавливаем в фоне. Запросы самой авторизации
  // не трогаем, иначе можно уйти в цикл.
  if (status === 401) {
    if (!url.includes("api/auth/")) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }

  // 403 у гостя на действиях участника — интерфейс сам предлагает войти
  // до запроса (useRequireMember), здесь молчим.
  if (status === 403) {
    return Promise.reject(error);
  }

  // Запрос ушёл, но ответа от сервера так и не пришло (сеть недоступна,
  // таймаут, обрыв соединения). id фиксированный, чтобы при обвале сразу
  // нескольких запросов не штамповались одинаковые тосты.
  if (!error.response) {
    toast.error("Нет соединения с сервером. Проверьте интернет.", {
      id: "network-error",
    });
    return Promise.reject(error);
  }

  if (error.response.data) {
    errorService.showError(error.response.data);
  } else {
    errorService.showError({
      statusCode: status || 500,
      message: error.message || "Unknown error",
      code: "UNKNOWN_ERROR",
      data: null,
    });
  }

  return Promise.reject(error);
};
