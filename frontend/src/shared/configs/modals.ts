import { lazy } from "react";
import { FilterGenresModal, FilterTagsModal } from "@/features/filter/";
import { FilterModal } from "@/features/filter/";

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
    import("@/entities/user/").then((module) => ({
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
  "search-filter": FilterModal,
  "search-genres-filter": FilterGenresModal,
  "search-tags-filter": FilterTagsModal,
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
