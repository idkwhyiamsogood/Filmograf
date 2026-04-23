"use client";

import type { FC } from "react";
import { useMemo, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";

import { MovieSkeletonWrapper, MovieWrapper } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";
import { useInfiniteMovies, useMovie } from "@/entities/movie";
import { LoadingSplashScreen } from "@/shared/components";
import type { SearchTypeMovie } from "@/shared/types";

import { useCatalog } from "../../model/hooks/useCatalog";

interface Props {
  type: SearchTypeMovie;
}

export const MovieContent: FC<Props> = memo(({ type }) => {
  const {
    entityIds: searchData,
    isLoading: isSearchLoading,
    isFetchingNextPage: isSearchFetchingNext,
    hasNextPage: searchHasNext,
    fetchNextPage: fetchSearchNext,
    activeType,
    query,
    hasActiveFilters,
  } = useCatalog();

  const isSearchMode = query.trim() !== "" || hasActiveFilters;

  const { data: searchMoviesBatch } = useMovie(searchData ?? []);

  const {
    movies: catalogMovies,
    fetchNextPage: fetchCatalogNext,
    hasNextPage: catalogHasNext,
    isFetchingNextPage: isCatalogFetchingNext,
    isLoading: isCatalogLoading,
  } = useInfiniteMovies({
    pageSize: 21,
    type: type,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const moviesToDisplay = useMemo(() => {
    if (isSearchMode) {
      return activeType === "Movie" ? (searchMoviesBatch ?? []) : [];
    }
    return catalogMovies ?? [];
  }, [isSearchMode, activeType, searchMoviesBatch, catalogMovies]);

  useEffect(() => {
    if (!inView) return;

    if (isSearchMode) {
      if (searchHasNext && !isSearchFetchingNext && activeType === "Movie") {
        fetchSearchNext();
      }
    } else {
      if (catalogHasNext && !isCatalogFetchingNext) {
        fetchCatalogNext();
      }
    }
  }, [inView]);

  if (isCatalogLoading || (isSearchLoading && !isSearchFetchingNext)) {
    return <LoadingSplashScreen />;
  }

  if (isSearchMode && moviesToDisplay.length === 0 && !isSearchLoading) {
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

  const isFetchingNext = isSearchMode
    ? isSearchFetchingNext
    : isCatalogFetchingNext;

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      <div className="py-8">
        {isFetchingNext && <MovieSkeletonWrapper count={9} />}
        <div ref={ref} className="h-10" />
      </div>
    </TabsContent>
  );
});
