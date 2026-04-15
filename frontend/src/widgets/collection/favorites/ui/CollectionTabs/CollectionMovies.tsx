"use client";

import React from "react";

// ui
import { TabsContent } from "@/shared/ui/tabs";
import { MovieWrapper } from "@/entities/movie";
import { LoadingSplashScreen } from "@/shared/components";

// hooks
import { useMovie } from "@/entities/movie";

interface Props {
  movieIds: string[] | string;
}

export const CollectionMovies: React.FC<Props> = ({ movieIds }) => {
  const { data: movies, isLoading } = useMovie(movieIds);

  if (!movies)
    return (
      <div className="flex items-center justify-center">
        Фильмов в коллекции не найдено.
      </div>
    );

  if (isLoading) return <LoadingSplashScreen />;

  return (
    <TabsContent value="default">
      <MovieWrapper movies={movies} />
    </TabsContent>
  );
};
