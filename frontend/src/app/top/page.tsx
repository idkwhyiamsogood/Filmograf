"use client";

import { type FC, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteMovies } from "@/entities/movie";
import { MovieWrapper } from "@/entities/movie";
import { WrappedSkeleton } from "@/entities/movie/";

const Page: FC = () => {
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
    return <WrappedSkeleton count={21} />;
  }

  return (
    <div>
      <MovieWrapper movies={movies} />

      <div ref={ref} className="py-8">
        {isFetchingNextPage && <WrappedSkeleton count={6} />}
      </div>

      {!hasNextPage && <div></div>}
    </div>
  );
};

export default Page;
