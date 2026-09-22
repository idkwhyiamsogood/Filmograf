import type { APIError } from "@/shared/types";
import { modalBridge } from "./modalBridge";
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

    if (!handler) return;
    if (modalBridge.isOpen(handler.type)) return;

    const props = handler.getProps ? handler.getProps(error) : undefined;
    modalBridge.open(handler.type, props as never);
  }

  clearListeners() {
    this.errorListeners = [];
  }
}

export const errorService = ErrorService.getInstance();
