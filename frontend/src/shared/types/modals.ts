import { MODALS } from "../configs";

export type ModalType = keyof typeof MODALS;

export interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
}

export interface ModalOptions {
  modalType: ModalType;
  modalProps?: any;
}

export interface ModalContextType {
  activeModals: ModalOptions[],
  openModal: (modalType: ModalType, modalProps?: any) => void;
  closeModal: () => void;
  closeModals: () => void;
}

export interface BaseModalProps {
  isOpen: boolean
}