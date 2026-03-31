"use client";

import React, { useEffect, useState } from "react";

import { CommonDropdownMenu } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { BookmarkMinus } from "lucide-react";

import {
  collectionApi,
  useCollections,
  useMovieToCollection,
  type Collection,
} from "@/entities/collection";
import { cn } from "@/shared/lib/utils";

interface Props {
  filmId: string;
}

export const MovieToCollection: React.FC<Props> = ({ filmId }) => {
  const [collectionsIds, setCollectionsIds] = useState<string[]>([]);
  const { data: collections = [] } = useCollections(collectionsIds);
  const { mutate: mutateMovieInCollection, isPending } = useMovieToCollection();

  useEffect(() => {
    const getMyCollections = async () => {
      try {
        const { data } = await collectionApi.getMy();
        setCollectionsIds(data?.ids || []);
      } catch (error) {
        console.error("Failed to load collections", error);
      }
    };

    getMyCollections();
  }, []);

  if (!collections || collections.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-2 py-1.5">
        Нет доступных коллекций
      </div>
    );
  }

  return (
    <CommonDropdownMenu
      trigger={
        <div className="fixed bottom-22 right-7.5 z-50">
          <Button
            className={cn(
              "rounded-full bg-accent w-10 h-10 text-accent-foreground",
            )}
          >
            <BookmarkMinus size={24} className="h-6! w-6!" strokeWidth={1.5} />
          </Button>
        </div>
      }
      content={
        <>
          {collections.map((collection: Collection) => {
            const isMovieInCurrentCollection = (
              collection.movies || []
            ).includes(filmId);

            return (
              <DropdownMenuItem
                key={collection.id}
                disabled={isPending}
                className={isMovieInCurrentCollection ? "bg-accent" : ""}
                onClick={() =>
                  mutateMovieInCollection({
                    movieId: filmId,
                    collectionId: collection.id,
                    shouldAdd: !isMovieInCurrentCollection,
                  })
                }
              >
                {collection.name}
              </DropdownMenuItem>
            );
          })}
        </>
      }
      align="center"
    />
  );
};
