export const ModalTypeEnum = {
  CREATE_BOOKMARK: "create-bookmark",
  CONFIRMATION_MENU: "confirmation-menu",
  UPDATE_BOOKMARK: "update-bookmark",
  AUTHORIZATION_MENU: "authorization-menu",
  SHOW_LOADING: "show-loading",
  RIGHT_MENU: "right-menu",
  SEARCH_FILTER: "search-filter",
  SEARCH_GENRES_FILTER: "search-genres-filter",
  SEARCH_TAGS_FILTER: "search-tags-filter",
  SELECT_SORTING: "select-sorting",
  CREATE_TAG: "create-tag",
} as const;

export type ModalType = (typeof ModalTypeEnum)[keyof typeof ModalTypeEnum];

export interface ModalPropsMap {}

export type ModalOptions = {
  [K in ModalType]: {
    modalType: K;
    modalProps: K extends keyof ModalPropsMap ? ModalPropsMap[K] : undefined;
  };
}[ModalType];

export type OpenModalArgs<K extends ModalType> = K extends keyof ModalPropsMap
  ? [modalType: K, modalProps: ModalPropsMap[K]]
  : [modalType: K];

export interface BaseModalProps {
  isOpen: boolean;
  closeModal: (type?: ModalType) => void;
}
