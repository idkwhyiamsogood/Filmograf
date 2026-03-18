"use client";

import { useState, type FC, useEffect } from "react";
import { useMovie, movieApi, IMovie } from "@/entities/movie";
import { MovieWrapper } from "@/entities/movie";

const Page: FC = () => {
  const [moviesData, setMoviesData] = useState<string[]>([]);

  useEffect(() => {
    const getTop = async () => {
      try {
        const { data } = await movieApi.getTop();
        console.log(data.ids)
        setMoviesData(data.ids);
      } catch (e) {
        console.log(e);
      }
    };
    
    getTop();
  }, []);

  const { data: movies, isLoading } = useMovie(moviesData);

  return <MovieWrapper movies={movies || []} isLoading={isLoading} />;
};

export default Page;
