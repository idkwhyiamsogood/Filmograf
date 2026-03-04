"use client";

import React from "react";

import { Button } from "@/shared/ui/button";
import { BookmarkMinus } from "lucide-react";
import { CommonDropdownMenu } from "@/shared/components";

import type { ICollection } from "entities/collection";
import { useCollections } from "entities/collection";
import { cn } from "@/shared/lib/utils";
import { addFilmToCollection } from "../model/addFilmToCollection";

interface Props {
  filmId: number;
}

export const FilmToCollection: React.FC<Props> = ({ filmId }) => {
  const { collections } = useCollections();

  const isFilmInCollection: boolean = collections.some(
    (collection: ICollection) => collection.films?.includes(filmId),
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
          {collections.map((collection: ICollection) => {
            <div
              className="cursor-pointer p-1 hover:bg-accent"
              key={`${collection.id}-${collection.label}-collection`}
              onClick={() => addFilmToCollection(filmId, collection)}
            >
              {collection.label}
            </div>;
          })}
        </>
      }
      align="center"
    />
  );
};
