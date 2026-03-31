"use client";

import React from "react";
import { MovieCarousel, useInfiniteMovies } from "@/entities/movie";

interface MoviesSectionProps {
  title: string;
  type: "top" | "recommended" | "popular";
  pageSize?: number;
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({
  title,
  type,
  pageSize = 21,
}) => {
  const { movies, isLoading, isError } = useInfiniteMovies({
    pageSize,
    type,
  });

  if (isError) return null;

  return <MovieCarousel title={title} movies={movies} isLoading={isLoading} />;
};
