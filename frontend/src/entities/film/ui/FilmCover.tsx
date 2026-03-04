"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import type { IFilm } from "../model/types/types";
import { FilmSkeleton } from "./FilmSkeleton";
import { useInView } from "react-intersection-observer";
import { mockFilm } from "../model/mock/film";

interface Props {
  filmId: number;
}

export const FilmCover: React.FC<Props> = ({ filmId }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: [0.3, 0.2, 0.1],
    rootMargin: "100px 0px",
  });

  const [film, setFilm] = useState<IFilm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      inView && setTimeout(() => setFilm(mockFilm), 100)
    } finally {
      setIsLoading(false)
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {isLoading || !film ? (
        <FilmSkeleton />
      ) : (
        <Link href={`/film/${film.id}`}>
          <article className="flex flex-col w-full rounded-2xl overflow-hidden select-none gap-2">
            <div className="relative">
              {/* todo change to IMAGE */}
              <img 
                src={film.img}
                alt={film.title}
                className="rounded-2xl h-37.5"
                height={300}
              />
            </div>

            <div className="flex flex-col px-1 pb-1 gap-1">
              <span className="font-semibold">{film.title}</span>
              <p className="text-sm text-gray-600 line-clamp-2">
                {film.description}
              </p>
            </div>
          </article>
        </Link>
      )}
    </div>
  );
};
