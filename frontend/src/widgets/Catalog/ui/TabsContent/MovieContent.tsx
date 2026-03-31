"use client";

// types
import type { FC } from "react";

// ui
import { MovieSkeletonWrapper, MovieWrapper } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";

// hooks
import { useInfiniteMovies } from "@/entities/movie";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const MovieContent: FC = () => {
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
    return <MovieSkeletonWrapper count={9} />;
  }

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={movies} />

      <div ref={ref} className="py-8">
        {isFetchingNextPage && <MovieSkeletonWrapper count={6} />}
      </div>

      {!hasNextPage && <div></div>}
    </TabsContent>
  );
};
