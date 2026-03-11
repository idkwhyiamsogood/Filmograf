import React from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";

import type { IMovie } from "../../model/types/types";
import { MovieCover } from "../FilmCover";

interface Props {
  title: string;
  movies: IMovie[]
}

export const MovieCarausel: React.FC<Props> = ({ title, movies }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xl">{title}</h3>
      <Carousel>
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem>
              <MovieCover movie={movie} isLoading={!movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
