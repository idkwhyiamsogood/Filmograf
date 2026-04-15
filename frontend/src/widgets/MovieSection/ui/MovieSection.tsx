"use client";

import React, { useCallback } from "react";
import { MovieCarousel, useInfiniteMovies } from "@/entities/movie";

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
  const { movies, isLoading, isError, fetchNextPage } = useInfiniteMovies({
    pageSize,
    type,
  });

  const handleFetch = useCallback(() => {
    if (hasFetch) fetchNextPage();
  }, [hasFetch, fetchNextPage]);

  if (isError) return null;
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