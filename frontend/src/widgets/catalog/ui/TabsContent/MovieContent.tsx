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
  const { data: searchData, isFetching: isSearchLoading, activeType, query, hasActiveFilters } = useCatalog();

  const { data: searchMovie } = useMovie(searchData?.entityIds ?? []);

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
    if (query.trim() !== "" || hasActiveFilters) {
      if (activeType === "Movie" && searchData?.entityIds?.length > 0) {
        return searchMovie ?? [];
      }

      return [];
    }

    return movies ?? [];
  }, [activeType, query, hasActiveFilters, searchData, searchMovie, movies]);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      query.trim() === "" &&
      !hasActiveFilters
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, query, hasActiveFilters]);

  if (isLoading || isSearchLoading) return 
    <LoadingSplashScreen />

  if ((query.trim() !== "" || hasActiveFilters) && moviesToDisplay.length === 0) {
    return (
      <TabsContent value="Movie">
        <div className="text-center py-8">
          <p className="text-gray-500">
            {query.trim() !== ""
              ? `Не найдено фильмов "${query}"`
              : "По заданным фильтрам ничего не найдено"}
          </p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      {query.trim() === "" && !hasActiveFilters && (
        <div className="py-8">
          {isFetchingNextPage && <MovieSkeletonWrapper count={9} />}
        </div>
      )}

      {query.trim() === "" && !hasActiveFilters && <div ref={ref} className="py-4" />}
    </TabsContent>
  );
});
