"use client";

import React, { createContext, useState, useCallback, ReactNode } from "react";
import { ModalType } from "../types";

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
}

interface ModalContextType {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
  openModal: (modalType: ModalType, modalProps?: any) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    modalType: null,
    modalProps: null,
  });

  const openModal = useCallback((modalType: ModalType, modalProps?: any) => {
    setModalState({
      isOpen: true,
      modalType,
      modalProps: modalProps || null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      modalType: null,
      modalProps: null,
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        modalType: modalState.modalType,
        modalProps: modalState.modalProps,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
