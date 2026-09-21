import Link from "@/shared/ui/link";
import React, { memo } from "react";

import type { IMovie } from "../model/types/types";

import Image from "@/shared/ui/image";

import { Badge } from "@/shared/ui/badge";

// lib
import { getValidURL } from "@/shared/lib";

interface Props {
  movie: IMovie;
}

export const MovieCover: React.FC<Props> = memo(({ movie }) => {
  return (
    <Link href={`/movies/${movie.id}`} className="block h-full">
      <article className="flex flex-col h-full w-full rounded-2xl overflow-hidden select-none gap-2">
        <div
          className="relative w-full flex-shrink-0"
          style={{ aspectRatio: "2/3" }}
        >
          <Image
            src={getValidURL(movie.imageUrl)}
            alt={movie.name}
            className="rounded-2xl object-cover"
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={true}
          />
          <Badge
            variant={"secondary"}
            className="absolute bottom-1.5 right-1.5 z-10"
          >
            {Object.values(movie.rates)[0]}
          </Badge>
        </div>

        <div className="flex flex-col px-1 pb-1 gap-1 flex-1 min-h-0">
          <span className="font-semibold text-[13px] line-clamp-1 break-words">
            {movie.name}
          </span>
          <p className="text-[12px] text-gray-600 line-clamp-2 break-words">
            {movie.description}
          </p>
        </div>
      </article>
    </Link>
  );
});

MovieCover.displayName = "MovieCover";
