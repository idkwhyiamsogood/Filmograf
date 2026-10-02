import React from "react";

import { useUpdateCollection } from "@/entities/collection";
import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";

import { CollectionFormSheet } from "../../../common/ui/CollectionFormSheet";
import type { UpdateCollectionModalProps } from "./props";

export const UpdateCollectionModal: React.FC<BaseModalProps & UpdateCollectionModalProps> = ({
  isOpen,
  collection,
}) => {
  const { closeModal } = useModals();
  const { mutate: updateCollection } = useUpdateCollection();

  return (
    <CollectionFormSheet
      isOpen={isOpen}
      mode="edit"
      initial={collection}
      onClose={() => closeModal("update-bookmark")}
      onSubmit={(data) => updateCollection({ id: collection.id, data })}
    />
  );
};
