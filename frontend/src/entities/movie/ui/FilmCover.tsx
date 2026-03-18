"use client";

import Link from "next/link";
import React, { memo, useEffect } from "react";

import { useInView } from "react-intersection-observer";
import { FilmSkeleton } from "./FilmSkeleton";

import type { IMovie } from "../model/types/types";

import Image from "next/image";

import { Badge } from "@/shared/ui/badge";

import { getAverageGrade } from "@/shared/lib";

// todo
// props
// function on view get movie from central storage if none send request

interface Props {
  movie: IMovie | undefined;
  isLoading: boolean;
}

export const MovieCover: React.FC<Props> = memo(({ movie, isLoading }) => {
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "100px 0px",
  });

  return (
    <div ref={ref}>
      {isLoading || !movie ? (
        <FilmSkeleton />
      ) : (
        <Link href={`/movie/${movie.id}`}>
          <article className="flex flex-col w-full rounded-2xl overflow-hidden select-none gap-2">
            <div className="relative h-full w-full">
              <Image
                src={movie.imageUrl}
                alt={movie.name}
                className="rounded-2xl h-37.5 sm:h-60"
                height={100}
                width={1000}
                objectFit="cover"
              />
              {/* <img
                src={movie.imageUrl}
                alt={movie.name}
                className="rounded-2xl h-37.5"
                height={300}
              /> */}
              <Badge
                variant={"secondary"}
                className="absolute bottom-1.5 right-1.5"
              >
                {getAverageGrade(movie.rates)}
              </Badge>
            </div>

            <div className="flex flex-col px-1 pb-1 gap-1">
              <span className="font-semibold text-[13px] line-clamp-2">
                {movie.name}
              </span>
              <p className="text-[12px] text-gray-600 line-clamp-2">
                {movie.description}
              </p>
            </div>
          </article>
        </Link>
      )}
    </div>
  );
});
