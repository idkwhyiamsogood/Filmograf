import React from "react";

import {
  MovieCover,
  MovieFull,
  MovieSkeleton,
  RankedMovieCard,
  useInfiniteMovies,
} from "@/entities/movie";
import { QueryErrorState, Rail, SectionHeader } from "@/shared/components";
import type { SearchTypeMovie } from "@/shared/types";
import { Skeleton } from "@/shared/ui/skeleton";

interface MoviesSectionProps {
  title: string;
  subtitle?: string;
  type: SearchTypeMovie;
  /** rail — лента постеров, ranked — «Топ-10» с цифрами, list — строки */
  variant?: "rail" | "ranked" | "list";
  limit?: number;
  viewAllHref?: string;
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({
  title,
  subtitle,
  type,
  variant = "rail",
  limit = 12,
  viewAllHref,
}) => {
  const { movies, isLoading, isError, error, refetch } = useInfiniteMovies({
    pageSize: Math.max(limit, 10),
    type,
    staleTime: type === "history" ? 0 : undefined,
  });

  const items = movies.slice(0, limit);

  if (!isLoading && !isError && items.length === 0) return null;

  const renderBody = () => {
    if (isError) {
      return (
        <QueryErrorState
          compact
          error={error}
          onRetry={() => refetch()}
          serverErrorMessage="Не удалось загрузить фильмы"
        />
      );
    }

    if (variant === "list") {
      return (
        <div className="flex flex-col gap-1 px-2">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3.5 p-2">
                  <Skeleton className="aspect-[2/3] w-[92px] rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2 py-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))
            : items.map((movie) => <MovieFull key={movie.id} movie={movie} />)}
        </div>
      );
    }

    const itemClassName =
      variant === "ranked" ? "w-[42%] sm:w-[26%]" : "w-[30%] sm:w-[20%]";

    return (
      <Rail itemClassName={itemClassName}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MovieSkeleton key={i} />)
          : items.map((movie, i) =>
              variant === "ranked" ? (
                <RankedMovieCard key={movie.id} movie={movie} rank={i + 1} />
              ) : (
                <MovieCover key={movie.id} movie={movie} />
              ),
            )}
      </Rail>
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title={title} subtitle={subtitle} href={viewAllHref} />
      {renderBody()}
    </section>
  );
};
