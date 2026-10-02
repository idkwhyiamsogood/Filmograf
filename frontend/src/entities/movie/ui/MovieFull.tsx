import React, { memo } from "react";

import Link from "@/shared/ui/link";
import { Poster } from "@/shared/ui/poster";
import { RatingBadge } from "@/shared/ui/rating-badge";
import { formatDuration } from "@/shared/lib";

import type { IMovie } from "../model/types/types";
import { useGenreNames } from "../lib/useGenreNames";

interface Props {
  movie: IMovie;
}

export const MovieFull: React.FC<Props> = memo(({ movie }) => {
  const genres = useGenreNames(movie.genreIds, 3);
  const meta = [movie.year, formatDuration(movie.time), `${movie.ageLimit ?? 0}+`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/movies/${movie.id}`} className="press group block w-full">
      <article className="flex gap-3.5 rounded-2xl p-2 transition-colors hover:bg-accent/60">
        <div className="w-[92px] shrink-0">
          <Poster src={movie.imageUrl} alt={movie.name} rounded="rounded-lg" width={92} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
          <h3 className="line-clamp-2 text-[15px] leading-snug font-bold">
            {movie.name}
          </h3>
          <p className="text-xs text-muted-foreground">{meta}</p>
          {genres.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {genres.join(", ")}
            </p>
          )}
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-foreground/80">
            {movie.description}
          </p>
          <RatingBadge value={movie.rates?.IMDb} variant="plain" className="mt-auto text-sm" />
        </div>
      </article>
    </Link>
  );
});

MovieFull.displayName = "MovieFull";
