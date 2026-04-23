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
import { IdsEntity } from "@/shared/types";
import type { SearchTypeMovie } from "@/shared/types";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  type: SearchTypeMovie;
}

export const MovieContent: FC<Props> = memo(({ type }) => {
  const { data: searchData, isFetching: isSearchLoading, activeType, query } = useCatalog();

  const { data: searchMovie } = useMovie(searchData.entityIds || []);

  const { movies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies({
      pageSize: 21,
      type: type,
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const moviesToDisplay = useMemo(() => {
    if (query.trim() !== "") {
      if (activeType === "Movie" && searchData?.entityIds?.length > 0) {
        return searchMovie ?? [];
      }

      return [];
    }

    return movies ?? [];
  }, [activeType, query, searchData, searchMovie, movies]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && query.trim() === "") {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, query]);

  if (isLoading || isSearchLoading) return 
    <LoadingSplashScreen />

  if (query.trim() !== "" && moviesToDisplay.length === 0) {
    return (
      <TabsContent value="Movie">
        <div className="text-center py-8">
          <p className="text-gray-500">Не найдено фильмов "{query}"</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      {query.trim() === "" && (
        <div className="py-8">
          {isFetchingNextPage && <MovieSkeletonWrapper count={9} />}
        </div>
      )}

      {query.trim() === "" && <div ref={ref} className="py-4" />}
    </TabsContent>
  );
});
