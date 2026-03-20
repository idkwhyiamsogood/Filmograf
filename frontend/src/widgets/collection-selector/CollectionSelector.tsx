"use client";

import React from "react";
import type { Collection } from "@/entities/collection";

import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { MovieWrapper, useMovie } from "@/entities/movie";

interface Props {
  collections: Collection[];
  onClick: (id: string) => void;
}

export const CollectionSelector: React.FC<Props> = ({
  collections,
  onClick,
}) => {
  if (!collections.length) {
    return <div>Нет доступных коллекций</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <Tabs defaultValue={collections[0]?.name}>
        <ScrollArea>
          <TabsList>
            {collections.map((collection, idx) => (
              <TabsTrigger
                value={collection.name}
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
              value={collection.name}
              key={"collection-content-" + String(idx)}
            >
              <MovieWrapper movies={movies || []} isLoading={isLoading} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};