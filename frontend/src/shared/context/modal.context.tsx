"use client";

import { modalService } from "@/shared/services/ModalService";
import { ModalContextType, ModalType } from "@/shared/types/modals";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

import type { ModalOptions } from "@/shared/types/modals";
import type { ModalState } from "@/shared/types/modals";

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModals, setActiveModals] = useState<ModalOptions[]>([]);

  useEffect(() => {
    const unsubscribe = modalService.subscribe((stack) => {
      setActiveModals(stack);
    });
    return unsubscribe;
  }, []);

  const openModal = (modalType: ModalType, modalProps?: any) => {
    modalService.open(modalType, modalProps);
  };

  const closeModal = () => {
    modalService.back();
  };

  const closeModals = () => {
    modalService.close();
  };

  return (
    <ModalContext.Provider
      value={{
        activeModals,
        openModal,
        closeModal,
        closeModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
