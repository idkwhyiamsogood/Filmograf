export const ModalTypeEnum = {
  CREATE_BOOKMARK: "create-bookmark",
  CONFIRMATION_MENU: "confirmation-menu",
  UPDATE_BOOKMARK: "update-bookmark",
  AUTHORIZATION_MENU: "authorization-menu",

  SEARCH_FILTER: "search-filter",

  SELECT_SORTING: "select-sorting",
  CREATE_TAG: "create-tag",
  APPEARANCE: "appearance",
  CLIPBOARD_LINK: "clipboard-link",
  USER_PROFILE: "user-profile",
} as const;

export type ModalType = (typeof ModalTypeEnum)[keyof typeof ModalTypeEnum];

export interface ModalPropsMap {
  "authorization-menu": { reason?: string } | undefined;
}

export type ModalOptions = {
  [K in ModalType]: {
    modalType: K;
    modalProps: K extends keyof ModalPropsMap ? ModalPropsMap[K] : undefined;
  };
}[ModalType];

export type OpenModalArgs<K extends ModalType> = K extends keyof ModalPropsMap
  ? undefined extends ModalPropsMap[K]
    ? [modalType: K, modalProps?: ModalPropsMap[K]]
    : [modalType: K, modalProps: ModalPropsMap[K]]
  : [modalType: K];

export interface BaseModalProps {
  isOpen: boolean;
  closeModal: (type?: ModalType) => void;
}
