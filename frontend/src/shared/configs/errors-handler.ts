import type { ModalType } from "@/shared/contexts/modal-context/modals.type";
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
