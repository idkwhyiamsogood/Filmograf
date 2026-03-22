import { lazy } from "react";

export const MODALS = {
  "create-bookmark": lazy(() =>
    import("@/features/collection/create-collection").then((module) => ({
      default: module.CreateCollectionModal,
    })),
  ),
  "confirmation-menu": lazy(() =>
    import("@/shared/components/").then((module) => ({
      default: module.ConfirmationModal,
    })),
  ),
  "update-bookmark": lazy(() =>
    import("@/features/collection/update-collection").then((module) => ({
      default: module.UpdateCollectionModal,
    })),
  ),
  "authorization-menu": lazy(() =>
    import("@/widgets/LoginModal/AuthorizationModal").then((module) => ({
      default: module.AuthorizationModal,
    })),
  ),
  "show-loading": lazy(() =>
    import("@/shared/components/").then((module) => ({
      default: module.LoadingSplashScreenModal,
    })),
  ),
  "right-menu": lazy(() =>
    import("@/widgets/RightMenu").then((module) => ({
      default: module.RightMenu,
    })),
  ),
  "search-filter": lazy(() =>
    import("@/features/filter/").then((module) => ({
      default: module.FilterModal,
    })),
  ),
  "search-genres-filter": lazy(() =>
    import("@/features/filter/").then((module) => ({
      default: module.FilterGenresModal,
    })),
  ),
  "select-sorting": lazy(() =>
    import("@/features/sort/").then((module) => ({
      default: module.SortingModal,
    })),
  ),
  "create-tag": lazy(() =>
    import("@/features/tags/create-tag").then((module) => ({
      default: module.CreateTagModal,
    })),
  ),
} as const;
