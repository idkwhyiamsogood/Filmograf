"use client";

import { useEffect, type FC } from "react";

import { useTopMovies } from "@/entities/movie";

import { movieApi } from "@/entities/movie/model/api/film.api";

import { MovieWrapper } from "@/entities/movie";

import type { IMovie } from "@/entities/movie";

const Page: FC = () => {
  const { data, isLoading } = useTopMovies();

  if (data) {
    console.log(data.data);
    return <MovieWrapper movies={data.data} isLoading={isLoading} />;
  }
};

export default Page;
