"use client";

import { FC } from "react";

import { MovieWrapper, useMyRates, useMovie } from "@/entities/movie";
import { LoadingSplashScreen } from "@/shared/components";

const Page: FC = () => {
  const { data: myRates, isLoading: isMyRatesLoading } = useMyRates();

  const ids = myRates
    ?.map((item) => item.movieId)
    .filter((item) => item !== "undefined");

  // console.log(ids);

  const { data: movies, isLoading: isMoviesLoading } = useMovie(ids || "");

  if (isMoviesLoading || isMyRatesLoading) return <LoadingSplashScreen />;

  if (!movies)
    return (
      <div className="flex flex-col gap-2.5">
        <span className="text-[30px] font-bold">Мои понравившиеся</span>
        <span className="text-muted-foreground text-sm">Вы еще не оценили ни одного фильма</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Мои понравившиеся</span>
      <MovieWrapper movies={movies} />
    </div>
  );
};

export default Page;
