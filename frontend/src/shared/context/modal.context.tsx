"use client";

import React, { createContext, useState, useCallback, ReactNode, useEffect } from "react";
import { ModalType } from "../types";

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
}

interface ModalHistoryItem {
  modalType: ModalType;
  modalProps: any;
}

interface ModalContextType {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
  openModal: (modalType: ModalType, modalProps?: any) => void;
  closeModal: () => void;
  prevModal: () => void;
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

  const [historyModal, setHistoryModal] = useState<ModalHistoryItem[]>([]);

  const openModal = useCallback((modalType: ModalType, modalProps?: any) => {
    setHistoryModal((prev) => [...prev, { modalType, modalProps: modalProps || null }]);

    setModalState({
      isOpen: true,
      modalType,
      modalProps: modalProps || null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setHistoryModal([]);

    setModalState({
      isOpen: false,
      modalType: null,
      modalProps: null,
    });
  }, []);

  const prevModal = useCallback(() => {
    if (historyModal.length <= 1) {
      closeModal();
      return;
    }
    
    setHistoryModal((prev) => {
      const newHistory = prev.slice(0, -1);
      const previousModal = newHistory[newHistory.length - 1];
      
      setModalState({
        isOpen: true,
        modalType: previousModal.modalType,
        modalProps: previousModal.modalProps,
      });
      
      return newHistory;
    });
  }, [historyModal, closeModal]);

  return (
    <ModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        modalType: modalState.modalType,
        modalProps: modalState.modalProps,
        openModal,
        closeModal,
        prevModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}