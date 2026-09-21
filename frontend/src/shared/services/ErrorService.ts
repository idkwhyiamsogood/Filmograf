import type { APIError } from "@/shared/types";
import { modalService } from "./ModalService";
import { ERROR_HANDLERS } from "../configs/errors-handler";

import type { ModalType } from "@/shared/types";

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

  private activeErrorTypes = new Set<ModalType>();

  showError(error: APIError): void {
    const statusCode = error.statusCode;
    const handler = ERROR_HANDLERS[statusCode];

    if (handler) {
      if (this.activeErrorTypes.has(handler.type)) return;

      const history = modalService.getHistory();
      const isAlreadyOpen = history.some((m) => m.modalType === handler.type);

      if (!isAlreadyOpen) {
        this.activeErrorTypes.add(handler.type);
        const props = handler.getProps ? handler.getProps(error) : {};

        modalService.open(handler.type, {
          ...props,
          onClose: () => {
            this.activeErrorTypes.delete(handler.type);
          },
        });
      }
    }
  }

  clearListeners() {
    this.errorListeners = [];
  }
}

export const errorService = ErrorService.getInstance();
