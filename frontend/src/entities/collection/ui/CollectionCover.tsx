import React, { memo } from "react";
import { BadgeCheck, Clapperboard, Lock } from "lucide-react";

import Link from "@/shared/ui/link";
import { Poster } from "@/shared/ui/poster";
import { pluralize } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";

import type { Collection } from "../model/types";

interface Props {
  collection: Collection;
  className?: string;
}

// Позиции постеров веера — в процентах от карточки, поэтому ничего не
// вылезает за края на любой ширине.
const FAN = [
  "left-[3%] top-[16%] w-[42%] -rotate-[7deg]",
  "right-[3%] top-[16%] w-[42%] rotate-[7deg]",
  "left-1/2 top-[6%] z-10 w-[48%] -translate-x-1/2 shadow-xl",
];

export const CollectionCover: React.FC<Props> = memo(({ collection, className }) => {
  const posters = collection.moviePreviews.slice(0, 3);
  const count = collection.movies.length;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn("press group block select-none", className)}
      aria-label={collection.name}
    >
      <article className="overflow-hidden rounded-2xl bg-card shadow-xs ring-1 ring-border transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-brand-soft to-muted">
          {posters.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-primary/70">
              <Clapperboard className="size-10" />
            </div>
          ) : posters.length < 3 ? (
            <div className="absolute top-[8%] left-1/2 w-[50%] -translate-x-1/2 shadow-xl">
              <Poster src={posters[0]} alt={collection.name} rounded="rounded-lg" width={90} />
            </div>
          ) : (
            posters.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className={cn(
                  "absolute transition-transform duration-300",
                  FAN[i],
                  i < 2 && "brightness-90",
                )}
              >
                <Poster src={src} alt="" rounded="rounded-lg" width={80} />
              </div>
            ))
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="flex flex-col gap-0.5 px-3 pt-1 pb-3">
          <h3 className="flex items-center gap-1 text-[13px] leading-tight font-bold">
            <span className="line-clamp-1">{collection.name}</span>
            {collection.isByFilmograf && (
              <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="От Filmograf" />
            )}
            {!collection.isPublic && (
              <Lock className="size-3 shrink-0 text-muted-foreground" aria-label="Скрытая" />
            )}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {pluralize(count, ["фильм", "фильма", "фильмов"])}
          </p>
        </div>
      </article>
    </Link>
  );
});

CollectionCover.displayName = "CollectionCover";
