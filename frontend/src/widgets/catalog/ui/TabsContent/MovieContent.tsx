"use client";

// types
import type { FC } from "react";

// ui
import { MovieSkeletonWrapper, MovieWrapper } from "@/entities/movie";
import { TabsContent } from "@/shared/ui/tabs";

// hooks
import { useInfiniteMovies, useMovie } from "@/entities/movie";
import { useCatalog } from "../../model/hooks/useCatalog";
import { useMemo, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";

export const MovieContent: FC = memo(() => {
  const { data: searchData, activeType, query } = useCatalog();

  const { data: searchMovie } = useMovie(searchData);

  const { movies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies({
      pageSize: 21,
      type: "top",
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const moviesToDisplay = useMemo(() => {
    if (
      activeType === "Movie" &&
      query.trim() !== "" &&
      searchData?.entityIds?.length > 0
    ) {
      return searchMovie ?? [];
    }

    return movies ?? [];
  }, [activeType, query, searchData, searchMovie, movies]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && query.trim() === "") {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, query]);

  if (isLoading && moviesToDisplay.length === 0) {
    return <MovieSkeletonWrapper count={9} />;
  }

  if (!moviesToDisplay) return (
    <div className="flex">
      Фильмы не найдены 
    </div>
  )

  return (
    <TabsContent value="Movie">
      <MovieWrapper movies={moviesToDisplay} />

      {query.trim() === "" && (
        <div className="py-8">
          {isFetchingNextPage && <MovieSkeletonWrapper count={9} />}
        </div>
      )}

      <div ref={ref} className="py-4" />
    </TabsContent>
  );
});
