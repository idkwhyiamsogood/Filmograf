import React, { memo } from "react";

import Link from "@/shared/ui/link";
import { Poster } from "@/shared/ui/poster";
import { RatingBadge } from "@/shared/ui/rating-badge";
import { cn } from "@/shared/lib/utils";

import type { IMovie } from "../model/types/types";

interface Props {
  movie: IMovie;
  rank: number;
  /** Для узких колонок: цифра меньше и не съедает ширину постера */
  compact?: boolean;
}

/** Карточка для «Топ-10»: крупная контурная цифра заходит под постер. */
export const RankedMovieCard: React.FC<Props> = memo(({ movie, rank, compact }) => (
  <Link
    href={`/movies/${movie.id}`}
    className="press flex items-end select-none"
    aria-label={`${rank}. ${movie.name}`}
  >
    <span
      aria-hidden
      className={cn(
        "relative z-10 shrink-0 leading-[0.8] font-extrabold tracking-tighter text-transparent",
        "[-webkit-text-stroke:2.5px_var(--color-primary)] drop-shadow-[0_2px_6px_rgb(0_0_0/0.35)]",
        compact ? "-mr-3 text-[52px]" : "-mr-2 text-[92px]",
      )}
    >
      {rank}
    </span>
    <div className="relative w-full min-w-0">
      <Poster src={movie.imageUrl} alt={movie.name} className="shadow-md ring-1 ring-black/5" />
      <RatingBadge value={movie.rates?.IMDb} className="absolute top-1.5 right-1.5" />
    </div>
  </Link>
));

RankedMovieCard.displayName = "RankedMovieCard";
