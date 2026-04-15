import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Collection, CreateCollection } from "@/entities/collection";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import { useCopyCollection } from "@/entities/collection";
import { usePinCollection } from "@/entities/collection-pins";
import { useUnpinCollection } from "@/entities/collection-pins";
import { useCollectionPins } from "@/entities/collection-pins";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  userId: string;
  collection: Collection;
};

export const CollectionActionsDropdown: React.FC<Props> = ({
  collection,
  userId,
}) => {
  const isCopiable = collection.userId !== userId && collection.isCopiable;
  const router = useRouter();

  const { data: pinned, isLoading } = useCollectionPins();

  const { mutate: copyCollection, isSuccess: isCopySuccess } =
    useCopyCollection();
  const { mutate: unpinCollection, isSuccess: isUnpinSuccess } =
    useUnpinCollection();
  const { mutate: pinCollection, isSuccess: isPinSuccess } = usePinCollection();

  const copyToCollection: CreateCollection = {
    name: collection.name + "( Копия)",
    tags: collection.tags,
    isPublic: collection.isPublic,
    isCommentable: collection.isCommentable,
    isCopiable: collection.isCopiable,
  };

  const copyData = {
    id: collection.id,
    data: copyToCollection,
  };

  const currentState = pinned.find((pin) => pin === collection.id)
    ? true
    : false;

  const handleCopy = () => {
    copyCollection(copyData);
  };

  const handleUnpin = () => {
    unpinCollection(collection.id);
  };

  const handlePin = () => {
    pinCollection(collection.id);
  };

  useEffect(() => {
    if (isCopySuccess || isUnpinSuccess || isPinSuccess) {
      router.push("/favorites");
    }
  }, [isCopySuccess, isUnpinSuccess, router]);

  if (isLoading) return <LoadingSplashScreen />;

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

        {currentState ? (
          <DropdownMenuItem onClick={handleUnpin}>
            Удалить из избранного
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handlePin}>
            Добавить в избранные
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
