"use client";

import { useState, type FC, useEffect } from "react";
import { useMovie, movieApi, IMovie } from "@/entities/movie";
import { MovieWrapper } from "@/entities/movie";

const Page: FC = () => {
  const [moviesData, setMoviesData] = useState<string[]>([]);

  useEffect(() => {
    const getTop = async () => {
      const { data } = await movieApi.getTop();
      setMoviesData(data.ids);
    };

    getTop();
  }, []);

  const { data: movies, isLoading } = useMovie(moviesData);

  return <MovieWrapper movies={movies || []} isLoading={isLoading} />;
};

export default Page;
