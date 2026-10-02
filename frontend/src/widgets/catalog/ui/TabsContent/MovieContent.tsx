import type { FC } from "react";
import { useEffect, memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { MovieSkeletonWrapper, MovieWrapper, type IMovie } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";
import { useInfiniteMovies } from "@/entities/movie";
import { EmptyState, QueryErrorState } from "@/shared/components";
import { SearchX } from "lucide-react";
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
    return <MovieSkeletonWrapper count={12} />;
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
        <EmptyState
          icon={SearchX}
          title="Ничего не нашлось"
          description={
            query.trim() !== ""
              ? `Фильмов по запросу «${query}» нет. Проверьте написание или попробуйте другое название.`
              : "Под эти фильтры фильмов нет — ослабьте условия."
          }
        />
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