import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import React from "react";

import { useDeleteCollection } from "@/entities/collection";
import { useModals } from "@/shared/contexts/modal-context";

interface Props {
  collectionId: string;
  onSuccess: () => void;
}

export const CollectionActions: React.FC<Props> = ({ collectionId, onSuccess }) => {
  const { openModal } = useModals();
  const { mutate: deleteCollection } = useDeleteCollection();

  const handleDelete = () => {
    openModal("confirmation-menu", {
      onConfirm: () => {
        deleteCollection(collectionId, {
          onSuccess: () => {
            onSuccess();
          },
        });
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-accent-foreground z-20 bg-accent rounded-full h-8 w-8"
        >
          <EllipsisVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          Удалить коллекцию
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
