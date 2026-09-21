import type { Collection } from "@/entities/collection";
import { MovieSkeletonWrapper, MovieWrapper, useMovie } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";
import React from "react";

interface Props {
  collection: Collection;
}

export const CollectionContent: React.FC<Props> = ({ collection }) => {
  const { data: movies, isLoading } = useMovie(collection.movies);

  return (
    <TabsContent
      value={collection.id}
      key={"collection-content-" + String(collection.id)}
    >
      {isLoading ? (
        <MovieSkeletonWrapper count={9} />
      ) : (
        <MovieWrapper movies={movies || []} />
      )}
    </TabsContent>
  );
};
