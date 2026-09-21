import { useModals } from "@/shared/hooks/useModals";
import { MODALS } from "@/shared/configs";
import { modalService } from "@/shared/services";
import { Suspense } from "react";
import { LoadingSplashScreen } from "@/shared/components";

export function ModalRenderer() {
  const { activeModals, closeModal, closeModals } = useModals();

  console.log(activeModals);

  if (activeModals.length === 0) return null;

  return (
    <>
      {activeModals.map((modal, index) => {
        const ModalComponent = MODALS[modal.modalType];

        if (!ModalComponent) return null;

        return (
          <Suspense
            key={`${modal.modalType}-${index}`}
            fallback={<LoadingSplashScreen />}
          >
            <ModalComponent
              {...modal.modalProps}
              key={modal.modalType}
              isOpen={true}
              onClose={closeModal}
              onCloseAll={closeModals}
              zIndex={1000 + index}
            />
          </Suspense>
        );
      })}
    </>
  );
}
