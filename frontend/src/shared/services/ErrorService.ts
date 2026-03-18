import type { APIError } from "@/shared/types";
import { modalService } from "./ModalService";
import { ERROR_HANDLERS } from "../configs/errors-handler";

type ErrorListener = (error: APIError) => void;

class ErrorService {
  private static instance: ErrorService;
  private errorListeners: ErrorListener[] = [];

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  subscribe(listener: ErrorListener) {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter((l) => l !== listener);
    };
  }

  showError(error: APIError): void {
    const statusCode = error.statusCode;
    const handler = ERROR_HANDLERS[statusCode];

    if (handler) {
      const props = handler.getProps ? handler.getProps(error) : {};

      modalService.open(handler.type, props);
    } else {
      modalService.open("confirmation-menu", {
        title: "Ошибка",
        message: error.message || "Произошла неизвестная ошибка",
        confirmText: "Ок",
      });
    }
  }

  clearListeners() {
    this.errorListeners = [];
  }
}

export const errorService = ErrorService.getInstance();
