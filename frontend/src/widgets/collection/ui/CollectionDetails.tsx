// types
import type { FC } from "react";

import { Collection } from "@/entities/collection";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CollectionMovies } from "./CollectionMovies";
import { CollectionComments } from "./CollectionComments";
import { Card, CardContent, CardDescription } from "@/shared/ui/card";

interface Props {
  collection: Collection;
}

export const CollectionDetails: FC<Props> = ({ collection }) => {
  const { movies: movieIds, id } = collection;

  return (
    <div className="flex flex-col gap-2.5">
      <Tabs>
        <TabsList className="bg-none w-full">
          <TabsTrigger value="default" className="">Фильмы</TabsTrigger>
          <TabsTrigger value="comments" className="">Комментарии</TabsTrigger>
        </TabsList>

        <CollectionMovies movieIds={movieIds} />
        <CollectionComments collectionId={id} />
      </Tabs>
    </div>
  );
};
