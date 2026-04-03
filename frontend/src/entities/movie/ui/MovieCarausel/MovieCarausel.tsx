"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { IMovie } from "../../model/types/types";
import { Button } from "@/shared/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { MovieCover } from "../MovieCover";
import { MovieFull } from "../MovieFull";
import { MovieSkeleton } from "../MovieSkeleton";

interface MovieCarouselProps {
  title: string;
  movies: IMovie[];
  isLoading: boolean;
  type: "full" | "partial";
  orientation: "horizontal" | "vertical";
  onFetch?: () => void;
  viewAllHref?: string;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  isLoading,
  type,
  orientation,
  onFetch,
  viewAllHref,
}) => {
  const MovieComponent = type === "full" ? MovieFull : MovieCover;

  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const className = useMemo(() => {
    return width < 380 ? "basis-1/2" : "basis-1/3";
  }, [width]);

  return (
    <section className="flex flex-col gap-4 py-4 px-2">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {viewAllHref && (
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href={viewAllHref}>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        )}
      </div>

      <Carousel
        opts={{ align: "start", loop: movies.length > 1 }}
        orientation={orientation}
        className="w-full"
      >
        <CarouselContent>
          {isLoading && movies.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <CarouselItem key={`skeleton-${idx}`} className={className}>
                  <MovieSkeleton />
                </CarouselItem>
              ))
            : movies.map((movie) => (
                <CarouselItem key={movie.id} className={className}>
                  <MovieComponent movie={movie} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>

      {onFetch && !isLoading && (
        <Button variant="outline" className="w-full mt-2" onClick={onFetch}>
          Показать больше
        </Button>
      )}
    </section>
  );
};
