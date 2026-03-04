"use client";

import { useModals } from "@/shared/hooks/useModals";
import { MODALS } from "@/shared/constants";

export function ModalRenderer() {
  const { isOpen, modalType, modalProps, closeModal } = useModals();

  if (!isOpen || !modalType) return null;

  const ModalComponent = MODALS[modalType];

  if (!ModalComponent) {
    console.log(`modal ${modalType} not found`);
    return null;
  }

  return <ModalComponent onClose={closeModal} {...modalProps} />;
};
