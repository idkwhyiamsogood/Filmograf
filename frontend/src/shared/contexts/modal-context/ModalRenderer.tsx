import { Suspense, type FC } from "react";
import { MODALS } from "./modals";
import { useModals } from "./useModals";

export const ModalRenderer: FC = () => {
  const { activeModals, closeModal } = useModals();

  return (
    <>
      {activeModals.map((modal) => {
        const ModalComponent = MODALS[modal.modalType];
        if (!ModalComponent) return null;

        return (
          <Suspense key={modal.key} fallback={null}>
            <ModalComponent
              {...(modal.modalProps as object)}
              // false — шторка уезжает вниз, потом провайдер её размонтирует
              isOpen={!modal.closing}
              closeModal={closeModal}
            />
          </Suspense>
        );
      })}
    </>
  );
};
