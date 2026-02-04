"use client";

import { useModals } from "@/shared/hooks/useModals";
import { CreateBookmarkModal } from "@/widgets/BookMarkSelector";
import { ConfirmationModal } from "@/widgets/ConfirmationModal";
import { UpdateBookmarkModal } from "@/widgets/BookMarkSelector"

export const MODALS: Record<string, React.ComponentType<any>> = {
  "create-bookmark": CreateBookmarkModal,
  "confirmation": ConfirmationModal,
  "update-bookmark": UpdateBookmarkModal,
}; 

export function ModalRenderer() {
  const { isOpen, modalType, modalProps, closeModal } = useModals();

  if (!isOpen) return null;

  const ModalComponent = MODALS[modalType || ""];

  if (!ModalComponent) {
    console.log(`modal ${modalType} not found`);
    return null;
  }

  return <ModalComponent onClose={closeModal} {...modalProps} />;
}
