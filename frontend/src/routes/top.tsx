import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CommonWrapper } from "@/shared/components";
import { useInfiniteMovies } from "@/entities/movie";
import { MovieWrapper } from "@/entities/movie";
import { MovieSkeletonWrapper } from "@/entities/movie/";

export const Route = createFileRoute("/top")({
  component: TopRoute,
});

function TopPage() {
  const { movies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies({
      pageSize: 21,
      type: "top",
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

  return (
    <div>
      <MovieWrapper movies={movies} />

      <div ref={ref} className="py-8">
        {isFetchingNextPage && <MovieSkeletonWrapper count={6} />}
      </div>

      {!hasNextPage && <div></div>}
    </div>
  );
}

function TopRoute() {
  return (
    <CommonWrapper>
      <TopPage />
    </CommonWrapper>
  );
}
