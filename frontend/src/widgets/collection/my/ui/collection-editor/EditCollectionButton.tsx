import React from "react";

import { Button } from "@/shared/ui/button";
import { Settings } from "lucide-react";

import { useModals } from "@/shared/hooks";
import { Collection } from "@/entities/collection";

interface Props {
  collection: Collection;
}

export const EditCollectionButton: React.FC<Props> = ({ collection }) => {
  const { openModal } = useModals();

  const handleOpenModal = () => {
    openModal("update-bookmark", { collection: collection });
  };

  return (
    <Button
      variant={"secondary"}
      onClick={handleOpenModal}
      className="max-w-full"
    >
      Настроить <Settings />
    </Button>
  );
};
