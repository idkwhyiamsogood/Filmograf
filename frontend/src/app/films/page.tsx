"use client";


import type { FC } from "react";

import { useTopMovies } from "@/entities/movie";

const Page: FC = () => {
  const topMovies = useTopMovies();

  console.log(topMovies.data, "qwertj")

  return (
    null
  );
};

export default Page;
