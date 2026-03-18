import type { ModalState, ModalOptions, ModalType } from "../types";

class ModalService {
  private listeners: ((state: ModalState | null) => void)[] = [];
  private history: ModalOptions[] = [];
  private static instance: ModalService;

  private constructor() {}

  static getInstance(): ModalService {
    if (!ModalService.instance) {
      ModalService.instance = new ModalService();
    }
    return ModalService.instance;
  }

  getCurrentState(): ModalState | null {
    if (this.history.length === 0) return null;

    const current = this.history[this.history.length - 1];
    return {
      isOpen: true,
      modalType: current.modalType,
      modalProps: current.modalProps,
    };
  }

  subscribe(listener: (state: ModalState | null) => void) {
    this.listeners.push(listener);

    const currentState = this.getCurrentState();
    if (currentState) {
      listener(currentState);
    }

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  open(modalType: ModalType, modalProps?: any) {
    const newItem: ModalOptions = {
      modalType: modalType,
      modalProps: modalProps || null,
    };

    this.history.push(newItem);
    this.notifyListeners();
  }

  close() {
    this.history = [];
    this.notifyListeners();
  }

  back() {
    if (this.history.length <= 1) {
      this.close();
    } else {
      this.history.pop();
      this.notifyListeners();
    }
  }

  isOpen(): boolean {
    return this.history.length > 0;
  }

  private notifyListeners() {
    const state = this.getCurrentState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const modalService = ModalService.getInstance();
