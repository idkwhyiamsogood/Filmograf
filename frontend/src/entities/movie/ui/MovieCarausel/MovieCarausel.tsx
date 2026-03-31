"use client";

import React from "react";

// types
import type { IMovie } from "../../model/types/types";

// ui
import { Button } from "@/shared/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MovieCover } from "../MovieCover";
import { MovieSkeleton } from "../MovieSkeleton";

interface Props {
  title: string;
  movies: IMovie[];
  isLoading: boolean;
}

export const MovieCarousel: React.FC<Props> = ({
  title,
  movies,
  isLoading,
}) => {
  const moviesLength = movies.length;

  return (
    <div className="flex flex-col gap-2.5 py-2.5 px-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-[22px]">{title + " фильмов"}</h2>
        <Button variant={"link"} className="text-accent-foreground">
          <Link href={"/top"}>
            <ArrowRight className="sizes-3" />
          </Link>
        </Button>
      </div>

      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 2 }).map((_, idx) => (
                <CarouselItem key={`skeleton-${idx}`} className="max-w-35 w-full">
                  <MovieSkeleton />
                </CarouselItem>
              ))
            : movies.map((movie, idx) => (
                <CarouselItem
                  key={movie.id || idx}
                  className="max-w-35"
                >
                  <MovieCover movie={movie} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
