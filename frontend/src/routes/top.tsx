import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CommonWrapper, PageHeader, QueryErrorState } from "@/shared/components";
import {
  MovieFull,
  MovieSkeletonWrapper,
  RankedMovieCard,
  useInfiniteMovies,
} from "@/entities/movie";

export const Route = createFileRoute("/top")({
  component: TopPage,
});

function TopPage() {
  const {
    movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteMovies({ pageSize: 21, type: "top" });

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const podium = movies.slice(0, 3);
  const rest = movies.slice(3);

  return (
    <CommonWrapper className="gap-5">
      <PageHeader back title="Топ фильмов" subtitle="Рейтинг по оценкам IMDb" />

      {isLoading ? (
        <MovieSkeletonWrapper count={9} />
      ) : isError ? (
        <QueryErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          {/* Тройка лидеров крупно */}
          <div className="grid grid-cols-3 gap-2">
            {podium.map((movie, i) => (
              <RankedMovieCard key={movie.id} movie={movie} rank={i + 1} compact />
            ))}
          </div>

          <ol className="-mx-2 flex flex-col">
            {rest.map((movie, i) => (
              <li key={movie.id} className="flex items-center gap-1">
                <span className="w-8 shrink-0 text-center text-lg font-extrabold text-muted-foreground tabular-nums">
                  {i + 4}
                </span>
                <div className="min-w-0 flex-1">
                  <MovieFull movie={movie} />
                </div>
              </li>
            ))}
          </ol>

          <div ref={ref} className="py-4">
            {isFetchingNextPage && <MovieSkeletonWrapper count={3} />}
          </div>
        </>
      )}
    </CommonWrapper>
  );
}
