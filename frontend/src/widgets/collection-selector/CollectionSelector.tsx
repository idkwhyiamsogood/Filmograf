"use client";

// types
import type { Collection } from "@/entities/collection";
import { memo, type FC } from "react";

// ui
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CollectionContent } from "./CollectionContent";

interface Props {
  collections: Collection[];
  onClick: (id: string) => void;
}

export const CollectionSelector: FC<Props> = memo(
  ({ collections, onClick }) => {
    if (!collections || collections.length === 0) return null;

    return (
      <div className="w-full">
        <Tabs defaultValue={collections[0].id} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max min-w-full justify-start">
              {collections.map((collection, idx) => (
                <TabsTrigger
                  value={collection.id}
                  onClick={() => onClick(collection.id)}
                  key={"collection-trigger-" + String(collection.id)}
                >
                  {collection.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {collections.map((collection, idx) => (
            <CollectionContent
              key={collection.id || idx}
              collection={collection}
            />
          ))}
        </Tabs>
      </div>
    );
  },
);

CollectionSelector.displayName = "CollectionSelector";
