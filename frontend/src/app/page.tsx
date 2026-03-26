"use client";

// types
import { FC, useEffect } from "react";

// components
import { useAuth, useModals } from "@/shared/hooks";

// ui
import { MovieCarousel } from "@/entities/movie/";

// hooks
import { useInfiniteMovies } from "@/entities/movie";
import { useInView } from "react-intersection-observer";

const Page: FC = () => {
  const { openModal } = useModals();
  const { token } = useAuth();

  const { movies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies({
      pageSize: 21,
      type: "top",
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "50px",
  });

  useEffect(() => {
    !token && openModal("authorization-menu");
  }, []);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-5">

      <MovieCarousel title="Топ" movies={movies} ref={ref} isLoading={isLoading}/>
    </div>
  );
};

export default Page;
