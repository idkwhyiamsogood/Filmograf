import { lazy, type FC } from "react";
import { ModalTypeEnum, type ModalType } from "./modals.type";

export const MODALS: Record<ModalType, FC<any>> = {
  [ModalTypeEnum.CREATE_BOOKMARK]: lazy(() =>
    import("@/features/collection/create-collection").then((m) => ({
      default: m.CreateCollectionModal,
    })),
  ),
  [ModalTypeEnum.CONFIRMATION_MENU]: lazy(() =>
    import("@/shared/components/").then((m) => ({
      default: m.ConfirmationModal,
    })),
  ),
  [ModalTypeEnum.UPDATE_BOOKMARK]: lazy(() =>
    import("@/features/collection/update-collection").then((m) => ({
      default: m.UpdateCollectionModal,
    })),
  ),
  [ModalTypeEnum.AUTHORIZATION_MENU]: lazy(() =>
    import("@/entities/user/").then((m) => ({
      default: m.AuthorizationModal,
    })),
  ),

  [ModalTypeEnum.SEARCH_FILTER]: lazy(() =>
    import("@/features/filter/").then((m) => ({
      default: m.FilterModal,
    })),
  ),

  [ModalTypeEnum.SELECT_SORTING]: lazy(() =>
    import("@/features/sort/").then((m) => ({
      default: m.SortingModal,
    })),
  ),
  [ModalTypeEnum.APPEARANCE]: lazy(() =>
    import("@/features/change-theme").then((m) => ({ default: m.AppearanceSheet })),
  ),
  [ModalTypeEnum.CLIPBOARD_LINK]: lazy(() =>
    import("@/features/clipboard-link").then((m) => ({ default: m.ClipboardLinkSheet })),
  ),
  [ModalTypeEnum.USER_PROFILE]: lazy(() =>
    import("@/features/user-profile").then((m) => ({ default: m.UserProfileSheet })),
  ),
  [ModalTypeEnum.CREATE_TAG]: lazy(() =>
    import("@/features/tags/create-tag").then((m) => ({
      default: m.CreateTagModal,
    })),
  ),
};
