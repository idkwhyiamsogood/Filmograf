import type { ModalState, ModalOptions, ModalType } from "../types";

class ModalService {
  private listeners: ((state: ModalOptions[]) => void)[] = [];
  private history: ModalOptions[] = [];
  private static instance: ModalService;

  private constructor() {}

  static getInstance(): ModalService {
    if (!ModalService.instance) {
      ModalService.instance = new ModalService();
    }

    return ModalService.instance;
  }

  getHistory(): ModalOptions[] {
    return [...this.history];
  }

  subscribe(listener: (state: ModalOptions[]) => void) {
    this.listeners.push(listener);
    listener(this.getHistory());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  open(modalType: ModalType, modalProps?: any) {
    const newItem: ModalOptions = { modalType, modalProps: modalProps || null };
    this.history.push(newItem);
    this.notifyListeners();
  }

  back() {
    this.history.pop();
    this.notifyListeners();
  }

  close() {
    this.history = [];
    this.notifyListeners();
  }

  private notifyListeners() {
    const state = this.getHistory();
    this.listeners.forEach((listener) => listener(state));
  }
}
export const modalService = ModalService.getInstance();
