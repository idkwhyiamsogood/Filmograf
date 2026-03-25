import { ModalType } from "@/shared/types/modals";
import type { APIError } from "../types";

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

  // 500: {
  //   type: "confirmation-menu",
  //   getProps: (error) => ({
  //     title: "Ошибка сервера",
  //     deskription: "Произошла внутренняя ошибка. Попробуйте позже.",
  //     confirmText: "Обновить",
  //     function: () => window.location.reload(),
  //   }),
  // },
};
