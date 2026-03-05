import { ConfirmationModal } from "@/shared/components";
import { CreateCollectionModal } from "@/features/collection/create-collection/";
import { UpdateCollectionModal } from "@/features/collection/update-collection";
import { AuthorizationModal } from "@/widgets/LoginModal/AuthorizationModal";
import { LoadingSplashScreenModal } from "@/shared/components/"

export const MODALS = {
  "create-bookmark": CreateCollectionModal,
  "confirmation": ConfirmationModal,
  "update-bookmark": UpdateCollectionModal,
  "authorization": AuthorizationModal,
  "loading": LoadingSplashScreenModal,
} as const; 