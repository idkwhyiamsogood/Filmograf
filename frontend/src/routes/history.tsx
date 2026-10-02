import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CommonWrapper, QueryErrorState } from "@/shared/components";
import {
  MovieSkeletonWrapper,
  MovieWrapper,
  useInfiniteMovies,
} from "@/entities/movie";

export const Route = createFileRoute("/history")({
  component: HistoryRoute,
});

function HistoryPage() {
  const {
    movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteMovies({
    pageSize: 21,
    type: "history",
    // История меняется при каждом открытии фильма — перезапрашиваем при заходе.
    staleTime: 0,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <MovieSkeletonWrapper count={21} />;
  }

  if (isError) {
    return <QueryErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">История просмотра</span>

      {movies.length === 0 ? (
        <span className="text-muted-foreground text-sm">
          Вы еще не открыли ни одного фильма
        </span>
      ) : (
        <>
          <MovieWrapper movies={movies} />

          <div ref={ref} className="py-8">
            {isFetchingNextPage && <MovieSkeletonWrapper count={6} />}
          </div>
        </>
      )}
    </div>
  );
}

function HistoryRoute() {
  return (
    <CommonWrapper>
      <HistoryPage />
    </CommonWrapper>
  );
}
