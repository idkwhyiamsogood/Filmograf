import { Suspense, type FC } from "react";
import { MODALS } from "./modals";
import { useModals } from "./useModals";

export const ModalRenderer: FC = () => {
  const { activeModals, closeModal } = useModals();

  return (
    <div>
      {activeModals.map((modal, index) => {
        const ModalComponent = MODALS[modal.modalType];

        if (!ModalComponent) return null;

        return (
          <ModalComponent
            {...(modal.modalProps as any)}
            key={modal.modalType}
            isOpen={true}
            closeModal={closeModal}
            zIndex={1000 + index}
          />
        );
      })}
    </div>
  );
};
