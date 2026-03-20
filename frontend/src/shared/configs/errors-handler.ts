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
      deskription: "Сессия истекла. Пожалуйста, войдите снова.",
    }),
  },

  403: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Доступ запрещен",
      deskription: "У вас нет прав для выполнения этого действия",
      confirmText: "Понятно",
    }),
  },

  404: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Ресурс не найден",
      deskription: `Запрашиваемый ресурс не существует`,
      confirmText: "Ок",
    }),
  },

  500: {
    type: "confirmation-menu",
    getProps: (error) => ({
      title: "Ошибка сервера",
      deskription: "Произошла внутренняя ошибка. Попробуйте позже.",
      confirmText: "Обновить",
      function: () => window.location.reload(),
    }),
  },

  503: {
    type: "show-loading",
    getProps: () => ({
      message: "Сервер временно недоступен. Пробуем переподключиться...",
    }),
  },
};
