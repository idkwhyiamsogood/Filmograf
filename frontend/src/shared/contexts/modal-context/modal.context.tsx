import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import type { ModalOptions, ModalType, OpenModalArgs } from "./modals.type";

/** Запись стека модалок: closing — идёт анимация закрытия, ещё смонтирована. */
export type ModalEntry = ModalOptions & { key: number; closing?: boolean };

interface ModalContextShape {
  activeModals: ModalEntry[];
  openModal: <K extends ModalType>(...args: OpenModalArgs<K>) => void;
  closeModal: (modal?: ModalType) => void;
  closeModals: () => void;
}

export const ModalContext = createContext<ModalContextShape | null>(null);

// Чуть дольше анимации закрытия шторки (200 мс), чтобы она успела уехать.
const CLOSE_ANIMATION_MS = 320;

let nextKey = 1;

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeModals, setActiveModals] = useState<ModalEntry[]>([]);
  const modalsRef = useRef<ModalEntry[]>([]);
  modalsRef.current = activeModals;

  const openModal = useCallback(
    <K extends ModalType>(...args: OpenModalArgs<K>) => {
      const [modalType, modalProps] = args;

      setActiveModals((prev) => {
        // Несколько запросов подряд не должны открыть стопку одинаковых модалок.
        if (prev.some((m) => m.modalType === modalType && !m.closing)) return prev;

        return [
          // Если такая же ещё доезжает вниз — заменяем её новой.
          ...prev.filter((m) => m.modalType !== modalType),
          { modalType, modalProps: modalProps ?? undefined, key: nextKey++ } as ModalEntry,
        ];
      });
    },
    [],
  );

  // Сначала помечаем closing (шторка проигрывает анимацию), потом убираем.
  const scheduleClose = useCallback((targets: ModalEntry[]) => {
    if (!targets.length) return;
    const keys = new Set(targets.map((t) => t.key));
    setActiveModals((prev) => prev.map((m) => (keys.has(m.key) ? { ...m, closing: true } : m)));
    window.setTimeout(() => {
      setActiveModals((prev) => prev.filter((m) => !keys.has(m.key)));
    }, CLOSE_ANIMATION_MS);
  }, []);

  const closeModal = useCallback(
    (modal?: ModalType) => {
      const open = modalsRef.current.filter((m) => !m.closing);
      const target = modal
        ? open.filter((m) => m.modalType === modal)
        : open.slice(-1);
      scheduleClose(target);
    },
    [scheduleClose],
  );

  const closeModals = useCallback(() => {
    scheduleClose(modalsRef.current.filter((m) => !m.closing));
  }, [scheduleClose]);

  return (
    <ModalContext.Provider value={{ activeModals, openModal, closeModal, closeModals }}>
      {children}
    </ModalContext.Provider>
  );
};
