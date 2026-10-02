import React, { memo } from "react";

import Link from "@/shared/ui/link";
import { Poster } from "@/shared/ui/poster";
import { RatingBadge } from "@/shared/ui/rating-badge";

import type { IMovie } from "../model/types/types";
import { useGenreNames } from "../lib/useGenreNames";

interface Props {
  movie: IMovie;
  priority?: boolean;
  /** Показать оценку пользователя вместо IMDb (экран «Мои оценки») */
  userRate?: number;
}

export const MovieCover: React.FC<Props> = memo(({ movie, priority, userRate }) => {
  const [genre] = useGenreNames(movie.genreIds, 1);
  const meta = [movie.year, genre].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="press group block h-full select-none"
      aria-label={movie.name}
    >
      <article className="flex h-full flex-col gap-2">
        <div className="relative">
          <Poster
            src={movie.imageUrl}
            alt={movie.name}
            priority={priority}
            className="shadow-sm ring-1 ring-black/5 transition-shadow group-hover:shadow-md"
          />
          {userRate ? (
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm">
              ★ {userRate}
            </span>
          ) : (
            <RatingBadge value={movie.rates?.IMDb} className="absolute top-1.5 left-1.5" />
          )}
        </div>

        <div className="flex flex-col gap-0.5 px-0.5">
          <h3 className="line-clamp-2 text-[13px] leading-tight font-bold">
            {movie.name}
          </h3>
          {meta && (
            <p className="truncate text-[11px] text-muted-foreground">{meta}</p>
          )}
        </div>
      </article>
    </Link>
  );
});

MovieCover.displayName = "MovieCover";
