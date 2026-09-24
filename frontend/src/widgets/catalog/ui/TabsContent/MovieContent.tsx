import type { FC } from "react";
import { useEffect, memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { MovieSkeletonWrapper, MovieWrapper, type IMovie } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";
import { useInfiniteMovies } from "@/entities/movie";
import { LoadingSplashScreen, QueryErrorState } from "@/shared/components";
import type { SearchTypeMovie } from "@/shared/types";

import { useCatalog } from "../../model/hooks/useCatalog";

interface Props {
  type: SearchTypeMovie;
}

export const MovieContent: FC<Props> = memo(({ type }) => {
  const {
    items, 
    isLoading: isSearchLoading,
    isFetchingNextPage: isSearchFetchingNext,
    hasNextPage: searchHasNext,
    fetchNextPage: fetchSearchNext,
    activeType,
    query,
    hasActiveFilters,
    isError: isSearchError,
    error: searchError,
    handleSearch,
  } = useCatalog();

  const isSearchMode = query.trim() !== "" || hasActiveFilters;

  const searchMovies = useMemo(() => {
    if (activeType !== "Movie") return [];
    return items.filter((item): item is IMovie => "year" in item);
  }, [items, activeType]);

  const {
    movies: catalogMovies,
    fetchNextPage: fetchCatalogNext,
    hasNextPage: catalogHasNext,
    isFetchingNextPage: isCatalogFetchingNext,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
    error: catalogError,
    refetch: refetchCatalog,
  } = useInfiniteMovies({
    pageSize: 21,
    type: type,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const moviesToDisplay = isSearchMode ? searchMovies : (catalogMovies ?? []);

  useEffect(() => {
    if (!inView) return;

    if (isSearchMode) {
      if (searchHasNext) fetchSearchNext();
    } else {
      if (catalogHasNext) fetchCatalogNext();
    }
  }, [inView, isSearchMode, searchHasNext, catalogHasNext, fetchSearchNext, fetchCatalogNext]);

  const showInitialLoader = isSearchMode
    ? isSearchLoading && !isSearchFetchingNext && moviesToDisplay.length === 0
    : isCatalogLoading && !isCatalogFetchingNext && moviesToDisplay.length === 0;

  if (showInitialLoader) {
    return <LoadingSplashScreen />;
  }

  const isError = isSearchMode ? isSearchError : isCatalogError;

  if (isError) {
    return (
      <TabsContent value="Movie">
        <QueryErrorState
          error={isSearchMode ? searchError : catalogError}
          onRetry={isSearchMode ? handleSearch : () => refetchCatalog()}
        />
      </TabsContent>
    );
  }

  if (isSearchMode && moviesToDisplay.length === 0 && !isSearchLoading) {
    return (
      <TabsContent value="Movie">
        <div className="text-center py-10">
          <p className="text-zinc-500">
            {query.trim() !== ""
              ? `Не найдено фильмов по запросу "${query}"`
              : "По заданным фильтрам ничего не найдено"}
          </p>
        </div>
      </TabsContent>
    );
  }

  const isFetchingNext = isSearchMode ? isSearchFetchingNext : isCatalogFetchingNext;

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      <div className="py-8 min-h-[100px]">
        {isFetchingNext && <MovieSkeletonWrapper count={6} />}
        {(isSearchMode ? searchHasNext : catalogHasNext) && (
          <div ref={ref} className="h-4" />
        )}
      </div>
    </TabsContent>
  );
});

MovieContent.displayName = "MovieContent";