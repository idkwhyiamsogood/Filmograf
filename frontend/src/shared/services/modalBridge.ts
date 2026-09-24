import type {
  ModalOptions,
  ModalType,
} from "@/shared/contexts/modal-context/modals.type";

type OpenModalFn = (type: ModalType, props?: unknown) => void;
type CloseModalFn = (type?: ModalType) => void;

let openModalRef: OpenModalFn | undefined;
let closeModalRef: CloseModalFn | undefined;
let activeModalsRef: ModalOptions[] = [];

// modal-context — заголовочный модуль, у него нет ничего, что можно
// дёрнуть вне React-дерева (в отличие от старого modalService). Этот мост
// даёт non-React коду (axios-интерцептору через ErrorService) доступ к
// живому openModal/closeModal/activeModals — регистрируется один раз из
// компонента внутри ModalProvider (см. ModalBridgeRegistrar в __root.tsx).
export const modalBridge = {
  register(
    openModal: OpenModalFn,
    closeModal: CloseModalFn,
    activeModals: ModalOptions[],
  ) {
    openModalRef = openModal;
    closeModalRef = closeModal;
    activeModalsRef = activeModals;
  },
  open(type: ModalType, props?: unknown) {
    openModalRef?.(type, props);
  },
  close(type?: ModalType) {
    closeModalRef?.(type);
  },
  isOpen(type: ModalType) {
    return activeModalsRef.some((modal) => modal.modalType === type);
  },
};
