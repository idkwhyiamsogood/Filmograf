import React from "react";

import { useCreateCollection } from "@/entities/collection";
import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";

import { CollectionFormSheet } from "../../common/ui/CollectionFormSheet";

export const CreateCollectionModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { mutate: createCollection } = useCreateCollection();
  const { closeModal } = useModals();

  return (
    <CollectionFormSheet
      isOpen={isOpen}
      mode="create"
      onClose={() => closeModal("create-bookmark")}
      onSubmit={(data) => createCollection(data)}
    />
  );
};
