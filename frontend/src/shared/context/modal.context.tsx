"use client";

import { modalService } from "@/shared/services/ModalService";
import { ModalContextType, ModalState, ModalType } from "@/shared/types/modals";
import { createContext, ReactNode, useEffect, useState } from "react";

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    modalType: null,
    modalProps: null,
  });

  useEffect(() => {
    const unsubscribe = modalService.subscribe((newState) => {
      if (newState) {
        setState(newState);
      } else {
        setState({
          isOpen: false,
          modalType: null,
          modalProps: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  const openModal = (modalType: ModalType, modalProps?: any) => {
    modalService.open(modalType, modalProps);
  };

  const closeModal = () => {
    modalService.close();
  };

  const prevModal = () => {
    modalService.back();
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
        prevModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
