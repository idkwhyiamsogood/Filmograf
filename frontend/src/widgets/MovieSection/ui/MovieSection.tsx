import React, { useCallback } from "react";
import { MovieCarousel, useInfiniteMovies } from "@/entities/movie";
import { QueryErrorState } from "@/shared/components";

interface MoviesSectionProps {
  title: string;
  type: "top" | "recommended" | "popular";
  pageSize?: number;
  carouselType?: "full" | "partial"; 
  orientation?: "horizontal" | "vertical";
  hasFetch?: boolean;
  viewAllHref?: string; 
};

export const MoviesSection: React.FC<MoviesSectionProps> = ({
  title,
  type,
  pageSize = 21,
  carouselType = "partial",
  orientation = "horizontal",
  hasFetch = false,
  viewAllHref,
}) => {
  const { movies, isLoading, isError, error, fetchNextPage, refetch } =
    useInfiniteMovies({
      pageSize,
      type,
    });

  const handleFetch = useCallback(() => {
    if (hasFetch) fetchNextPage();
  }, [hasFetch, fetchNextPage]);

  if (isError) {
    return (
      <div className="px-2">
        <h2 className="text-xl font-semibold tracking-tight px-1 mb-2">
          {title}
        </h2>
        <QueryErrorState
          compact
          error={error}
          onRetry={() => refetch()}
          serverErrorMessage="Не удалось загрузить фильмы"
        />
      </div>
    );
  }
  if (!isLoading && movies.length === 0) return null;

  return (
    <MovieCarousel
      title={title}
      movies={movies}
      isLoading={isLoading}
      type={carouselType}
      orientation={orientation}
      onFetch={hasFetch ? handleFetch : undefined}
      viewAllHref={viewAllHref}
    />
  );
};