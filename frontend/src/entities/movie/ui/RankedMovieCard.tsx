import React, { memo } from "react";

import Link from "@/shared/ui/link";
import { Poster } from "@/shared/ui/poster";
import { RatingBadge } from "@/shared/ui/rating-badge";
import { cn } from "@/shared/lib/utils";

import type { IMovie } from "../model/types/types";
import { useGenreNames } from "../lib/useGenreNames";

interface Props {
  movie: IMovie;
  rank: number;
}

// Первая тройка — «медали», остальные — нейтральная плашка.
const MEDAL: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950",
  2: "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-900",
  3: "bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950",
};

/** Карточка рейтинга: место — плашкой в углу постера, без декоративных цифр. */
export const RankedMovieCard: React.FC<Props> = memo(({ movie, rank }) => {
  const [genre] = useGenreNames(movie.genreIds, 1);
  const meta = [movie.year, genre].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="press group block select-none"
      aria-label={`${rank} место: ${movie.name}`}
    >
      <article className="flex flex-col gap-2">
        <div className="relative">
          <Poster
            src={movie.imageUrl}
            alt={movie.name}
            width={150}
            className="shadow-sm ring-1 ring-black/5"
          />
          <span
            className={cn(
              "absolute bottom-1.5 left-1.5 flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-sm font-extrabold tabular-nums shadow-md",
              MEDAL[rank] ?? "bg-black/60 text-white backdrop-blur-md",
            )}
          >
            {rank}
          </span>
          <RatingBadge value={movie.rates?.IMDb} className="absolute top-1.5 right-1.5" />
        </div>
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3 className="line-clamp-2 text-[13px] leading-tight font-bold">{movie.name}</h3>
          {meta && <p className="truncate text-[11px] text-muted-foreground">{meta}</p>}
        </div>
      </article>
    </Link>
  );
});

RankedMovieCard.displayName = "RankedMovieCard";
