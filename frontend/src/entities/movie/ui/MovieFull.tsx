import Image from "next/image";
import Link from "next/link";
import React, { memo, useCallback } from "react";
import type { IMovie } from "../model/types/types";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

interface Props {
  movie: IMovie;
}

export const MovieFull: React.FC<Props> = memo(({ movie }) => {
  const formattedDate = useCallback((dateValue: any) => {
    const d = new Date(dateValue);

    return d instanceof Date && !isNaN(d.getTime())
      ? d.toLocaleDateString("ru-RU")
      : "";
  }, []);

  return (
    <Link href={`/movies/${movie.id}`} className="block w-full group">
      <article className="flex gap-4 p-2 transition-colors hover:bg-accent/50 rounded-xl">
        <div className="relative flex-shrink-0 w-[100px] aspect-[2/3]">
          <Image
            src={movie.imageUrl}
            alt={movie.name}
            fill
            className="rounded-lg object-cover max-h-40"
            sizes="100px"
          />
          <Badge
            variant={"secondary"}
            className="absolute bottom-1.5 right-1.5 z-10"
          >
            {Object.values(movie.rates)[0].toFixed(1)}
          </Badge>
        </div>

        <div className="flex flex-col flex-1 py-1 min-w-0">
          <div className="relative flex justify-between items-center mb-2">
            <h3 className="text-[16px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {movie.name}
            </h3>
          </div>

          <p className="text-sm line-clamp-5">{movie.description}</p>
          <span className="text-[10px]">{formattedDate(movie.createDate)}</span>
        </div>
      </article>
      <Separator className="mt-2.5" />
    </Link>
  );
});

MovieFull.displayName = "MovieFull";
