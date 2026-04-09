import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Collection } from "@/entities/collection";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import { useCopyCollection } from "@/entities/collection";
import { useUnpinCollection } from "@/entities/collection-pins";

interface Props {
  userId: string;
  collection: Collection;
}

export const CollectionActionsDropdown: React.FC<Props> = ({
  collection,
  userId,
}) => {
  const isCopiable = collection.userId !== userId && collection.isCopiable;
  const router = useRouter();

  const { mutate: copyCollection, isSuccess: isCopySuccess } =
    useCopyCollection();
  const { mutate: unpinCollection, isSuccess: isUnpinSuccess } =
    useUnpinCollection();

  const handleCopy = () => {
    copyCollection(collection.id);
  };

  const handleUnpin = () => {
    unpinCollection(collection.id);
  };

  useEffect(() => {
    if (isCopySuccess || isUnpinSuccess) {
      router.push("/favorites");
    }
  }, [isCopySuccess, isUnpinSuccess, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="absolute top-0 right-0 text-accent-foreground z-20"
        asChild
      >
        <Button variant="ghost">
          <EllipsisVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isCopiable && (
          <DropdownMenuItem onClick={handleCopy}>
            Скопировать подборку
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopy}>
          Скопировать подборку
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUnpin}>
          Удалить подборку
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
