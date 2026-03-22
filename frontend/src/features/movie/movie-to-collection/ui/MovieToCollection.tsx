"use client";

import React, { useEffect, useMemo, useState } from "react";

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

  if (!collections || !collections.length) {
    return (
      <div className="text-sm text-muted-foreground px-2 py-1.5">
        Нет доступных коллекций
      </div>
    )
  }

  const isFilmInCollection = useMemo(
    () =>
      collections.some((collection: Collection) =>
        (collection.movies || []).includes(filmId),
      ),
    [collections, filmId],
  );

  return (
    <CommonDropdownMenu
      trigger={
        <Button className="rounded-full bg-blue w-10 h-10">
          <BookmarkMinus
            size={24}
            className="h-6! w-6!"
            strokeWidth={1.5}
            {...(isFilmInCollection ? { fill: "white" } : {})}
          />
        </Button>
      }
      content={
        <>
          {collections.map((collection: Collection) => {
            const isMovieInCurrentCollection = (collection.movies || []).includes(
              filmId,
            );

            return (
              <DropdownMenuItem
                key={collection.id}
                disabled={isPending}
                onClick={() =>
                  mutateMovieInCollection({
                    movieId: filmId,
                    collectionId: collection.id,
                    shouldAdd: !isMovieInCurrentCollection,
                  })
                }
              >
                {collection.name}
                {isMovieInCurrentCollection ? " (добавлен)" : ""}
              </DropdownMenuItem>
            );
          })}
        </>
      }
      align="center"
    />
  );
};
