import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from "react";
import type { ModalOptions, ModalPropsMap, ModalType, OpenModalArgs } from "./modals.type";

interface ModalContextShape {
  activeModals: ModalOptions[];
  openModal: <K extends ModalType>(...args: OpenModalArgs<K>) => void;
  closeModal: (modal?: ModalType) => void;
  closeModals: () => void;
}

export const ModalContext = createContext<ModalContextShape | null>(null);

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeModals, setActiveModals] = useState<ModalOptions[]>([]);

  const openModal = useCallback(
    <K extends ModalType>(...args: OpenModalArgs<K>) => {
      const [modalType, modalProps] = args;
      
      setActiveModals((prev) => {
        // Несколько запросов с 401 подряд не должны открыть стопку одинаковых
        // модалок: проверка по prev надёжнее, чем modalBridge.isOpen, который
        // видит состояние только с прошлого рендера.
        if (prev.some((item) => item.modalType === modalType)) return prev;

        return [
          ...prev,
          {
            modalType,
            modalProps: modalProps ?? undefined,
          } as ModalOptions,
        ];
      });
    },
    [],
  );

  const closeModal = useCallback((modal?: ModalType) => {
    if (modal) {
      setActiveModals((prev) =>
        prev.filter((item) => item.modalType !== modal),
      );
    } else {
      setActiveModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const closeModals = useCallback(() => {
    setActiveModals([]);
  }, []);

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
};
