"use client";

// types
import type { Collection } from "@/entities/collection";
import { memo, type FC } from "react";

// ui
import { MovieSkeletonWrapper, MovieWrapper } from "@/entities/movie";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

// hooks
import { useMovie } from "@/entities/movie";

interface Props {
  collections: Collection[];
  onClick: (id: string) => void;
}

export const CollectionSelector: FC<Props> = memo(
  ({ collections, onClick }) => {
    if (!collections || collections.length === 0) return null;

    return (
      <div className="flex flex-row gap-1">
        <Tabs defaultValue={collections[0].id}>
          <ScrollArea>
            <TabsList>
              {collections.map((collection, idx) => (
                <TabsTrigger
                  value={collection.id}
                  onClick={() => onClick(collection.id)}
                  key={"collection-" + String(idx)}
                >
                  {collection.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar hidden orientation="horizontal" />
          </ScrollArea>

          {collections.map((collection, idx) => {
            const { data: movies, isLoading } = useMovie(collection.movies);

            return (
              <TabsContent
                value={collection.id}
                key={"collection-content-" + String(idx)}
              >
                {isLoading ? (
                  <MovieSkeletonWrapper count={9} />
                ) : (
                  <MovieWrapper movies={movies || []} />
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    );
  },
);

CollectionSelector.displayName = "CollectionsSelector";
