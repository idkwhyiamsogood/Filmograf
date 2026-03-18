"use client";

import { useModals } from "@/shared/hooks/useModals";
import { MODALS } from "@/shared/configs";

import { Suspense } from "react";
import { LoadingSplashScreen } from "@/shared/components";

export function ModalRenderer() {
  const { isOpen, modalType, modalProps, closeModal } = useModals();

  if (!isOpen || !modalType) return null;

  const ModalComponent = MODALS[modalType];

  if (!ModalComponent) {
    console.log(`modal ${modalType} not found`);
    return null;
  }

  return (
    <Suspense fallback={<LoadingSplashScreen />}>
      <ModalComponent onClose={closeModal} {...modalProps} />
    </Suspense>
  );
}
