import { errorService, modalService } from "@/shared/services";
import type { APIError } from "../types";
import { ModalType } from "@/shared/types/modals";

export const ERROR_HANDLERS: Record<
  number,
  {
    type: ModalType;
    getProps?: (error: APIError) => any;
  }
> = {
  401: {
    type: "authorization-menu",
    getProps: (error) => ({
      message: "Сессия истекла. Пожалуйста, войдите снова.",
      redirectUrl: window.location.pathname,
    }),
  },

  403: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Доступ запрещен",
      message: "У вас нет прав для выполнения этого действия",
      confirmText: "Понятно",
    }),
  },

  404: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Ресурс не найден",
      message: `Запрашиваемый ресурс не существует`,
      confirmText: "Ок",
    }),
  },

  500: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Ошибка сервера",
      message: "Произошла внутренняя ошибка. Попробуйте позже.",
      confirmText: "Обновить",
      onConfirm: () => window.location.reload(),
    }),
  },

  503: {
    type: "show-loading",
    getProps: () => ({
      message: "Сервер временно недоступен. Пробуем переподключиться...",
    }),
  },
};