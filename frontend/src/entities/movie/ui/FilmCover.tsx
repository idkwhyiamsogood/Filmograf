"use client";

import Link from "next/link";
import React from "react";

import { useInView } from "react-intersection-observer";
import { FilmSkeleton } from "./FilmSkeleton";

import type { IMovie } from "../model/types/types";

import Image from "next/image";

interface Props {
  movie: IMovie;
  isLoading: boolean;
}

export const MovieCover: React.FC<Props> = ({ movie, isLoading }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: [0.3, 0.2, 0.1],
    rootMargin: "100px 0px",
  });

  return (
    <div ref={ref}>
      {isLoading || !movie ? (
        <FilmSkeleton />
      ) : (
        <Link href={`/movie/${movie.id}`}>
          <article className="flex flex-col w-full rounded-2xl overflow-hidden select-none gap-2">
            <div className="relative">
              <Image 
                src={movie.imageUrl}
                alt={movie.name}
                className="rounded-2xl h-37.5"
                height={300}
              />
            </div>

            <div className="flex flex-col px-1 pb-1 gap-1">
              <span className="font-semibold">{movie.name}</span>
              <p className="text-sm text-gray-600 line-clamp-2">
                {movie.description}
              </p>
            </div>
          </article>
        </Link>
      )}
    </div>
  );
};
