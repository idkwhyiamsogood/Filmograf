import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { History } from "lucide-react";

import { CommonWrapper, EmptyState, PageHeader, QueryErrorState } from "@/shared/components";
import { MovieSkeletonWrapper, MovieWrapper, useInfiniteMovies } from "@/entities/movie";
import { Button } from "@/shared/ui/button";
import Link from "@/shared/ui/link";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
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

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <CommonWrapper className="gap-4">
      <PageHeader back title="История просмотра" subtitle="Последние открытые — сверху" />

      {isLoading ? (
        <MovieSkeletonWrapper count={12} />
      ) : isError ? (
        <QueryErrorState error={error} onRetry={() => refetch()} />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={History}
          title="История пока пуста"
          description="Здесь появятся фильмы, которые вы открывали."
          action={
            <Button asChild className="h-11 rounded-xl px-5 font-bold">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          }
        />
      ) : (
        <>
          <MovieWrapper movies={movies} />
          <div ref={ref} className="py-4">
            {isFetchingNextPage && <MovieSkeletonWrapper count={6} />}
          </div>
        </>
      )}
    </CommonWrapper>
  );
}
