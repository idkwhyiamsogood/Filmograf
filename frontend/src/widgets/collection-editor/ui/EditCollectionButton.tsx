"use client";

import React from "react";

import { Button } from "@/shared/ui/button";
import { Settings } from "lucide-react";

import { useModals } from "@/shared/hooks";

interface Props {
  collectionId: string;
}

export const EditCollectionButton: React.FC<Props> = ({ collectionId }) => {
  const { openModal } = useModals();

  const handleOpenModal = () => {
    openModal("update-bookmark", { data: { id: collectionId } });
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
