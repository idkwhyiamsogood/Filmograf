import React from "react";
import Link from "@/shared/ui/link";
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
  const isFull = type === "full";
  const MovieComponent = isFull ? MovieFull : MovieCover;

  const renderContent = () => {
    if (isLoading && movies.length === 0) {
      return Array.from({ length: 4 }).map((_, idx) => (
        <React.Fragment key={`skeleton-${idx}`}>
          {isFull ? (
            <MovieSkeleton />
          ) : (
            <CarouselItem className="basis-1/3">
              <MovieSkeleton />
            </CarouselItem>
          )}
        </React.Fragment>
      ));
    }

    return movies.map((movie) => (
      <React.Fragment key={movie.id}>
        {isFull ? (
          <MovieComponent movie={movie} />
        ) : (
          <CarouselItem className="basis-1/3">
            <MovieComponent movie={movie} />
          </CarouselItem>
        )}
      </React.Fragment>
    ));
  };

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

      {isFull ? (
        <div className="flex flex-col gap-4 w-full">
          {renderContent()}
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: movies.length > 1,
            dragThreshold: 5,
            dragFree: true,
          }}
          orientation={orientation}
          className="w-full"
        >
          <CarouselContent>
            {renderContent()}
          </CarouselContent>
        </Carousel>
      )}

      {onFetch && !isLoading && (
        <Button variant="outline" className="w-full mt-2" onClick={onFetch}>
          Показать больше
        </Button>
      )}
    </section>
  );
};