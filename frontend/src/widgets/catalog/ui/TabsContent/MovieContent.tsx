"use client";

// types
import type { FC } from "react";

// ui
import { MovieSkeletonWrapper, MovieWrapper } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";

// hooks
import { useInfiniteMovies, useMovie } from "@/entities/movie";
import { useCatalog } from "../../model/hooks/useCatalog";
import { useMemo, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";

export const MovieContent: FC = memo(() => {
  const { data: searchData, activeType } = useCatalog();

  console.log(searchData);

  const { data: searchMovie } = useMovie(
    searchData ? searchData.entityIds : [],
  );

  const { movies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies({
      pageSize: 21,
      type: "top",
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const moviesToDisplay = useMemo(() => {
    if (activeType === "Movie" && searchData) {
      return searchMovie ?? [];
    }
    return movies ?? [];
  }, [activeType, searchData, searchMovie, movies]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !searchData) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, searchData]);

  if (isLoading && moviesToDisplay.length === 0) {
    return <MovieSkeletonWrapper count={9} />;
  }

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      {!searchData && (
        <div ref={ref} className="py-8">
          {isFetchingNextPage && <MovieSkeletonWrapper count={6} />}
        </div>
      )}
    </TabsContent>
  );
});

MovieContent.displayName = "CatalogMovieContent";