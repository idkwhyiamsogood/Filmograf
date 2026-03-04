import { ConfirmationModal } from "@/shared/components";
import { CreateCollectionModal } from "@/features/collection/create-collection/";
import { UpdateCollectionModal } from "@/features/collection/update-collection";

export const MODALS = {
  "create-bookmark": CreateCollectionModal,
  "confirmation": ConfirmationModal,
  "update-bookmark": UpdateCollectionModal,
} as const; 