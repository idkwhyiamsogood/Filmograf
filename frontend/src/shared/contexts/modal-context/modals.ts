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
  [ModalTypeEnum.SHOW_LOADING]: lazy(() =>
    import("@/shared/components/").then((m) => ({
      default: m.LoadingSplashScreenModal,
    })),
  ),
  [ModalTypeEnum.RIGHT_MENU]: lazy(() =>
    import("@/widgets/RightMenu").then((m) => ({
      default: m.RightMenu,
    })),
  ),
  [ModalTypeEnum.SEARCH_FILTER]: lazy(() =>
    import("@/features/filter/").then((m) => ({
      default: m.FilterModal,
    })),
  ),
  [ModalTypeEnum.SEARCH_GENRES_FILTER]: lazy(() =>
    import("@/features/filter/").then((m) => ({
      default: m.FilterGenresModal,
    })),
  ),
  [ModalTypeEnum.SEARCH_TAGS_FILTER]: lazy(() =>
    import("@/features/filter/").then((m) => ({
      default: m.FilterTagsModal,
    })),
  ),
  [ModalTypeEnum.SELECT_SORTING]: lazy(() =>
    import("@/features/sort/").then((m) => ({
      default: m.SortingModal,
    })),
  ),
  [ModalTypeEnum.CREATE_TAG]: lazy(() =>
    import("@/features/tags/create-tag").then((m) => ({
      default: m.CreateTagModal,
    })),
  ),
};
