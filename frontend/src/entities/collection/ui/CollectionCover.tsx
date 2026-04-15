import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Collection } from "../model/types";

interface Props {
  collection: Collection;
}

export const CollectionCover: React.FC<Props> = ({ collection }) => {
  const hasPosters = collection.moviePreviews.length === 3;
  const posters = collection.moviePreviews

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="block w-full border-1 px-1 overflow-hidden rounded-xl"
    >
      <Card
        className={
          "group relative w-full cursor-pointer overflow-visible border-none bg-transparent shadow-none transition-transform duration-300 hover:-translate-y-1"
        }
      >
        <CardContent className="p-0">
          <div className="relative mx-auto mb-3 h-40 sm:h-48">
            {hasPosters ? (
              <>
                {/* Левая карточка */}
                <div
                  className="absolute bottom-2 left-1/2 h-32 w-22 -translate-x-[85%] -rotate-[10deg] transition-all duration-300 group-hover:-rotate-[12deg] group-hover:-translate-x-[90%]"
                  style={{ zIndex: 1, transformOrigin: "bottom center" }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={posters[0]}
                      alt="poster 3"
                      fill
                      className="rounded-lg object-cover shadow-md brightness-90"
                      sizes="(max-width: 375px) 88px, 100px"
                    />
                  </div>
                </div>

                {/* Правая карточка */}
                <div
                  className="absolute bottom-2 left-1/2 h-32 w-22 -translate-x-[15%] rotate-[10deg] transition-all duration-300 group-hover:rotate-[12deg] group-hover:translate-x-[0%]"
                  style={{ zIndex: 2, transformOrigin: "bottom center" }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={posters[1]}
                      alt="poster 2"
                      fill
                      className="rounded-lg object-cover shadow-md brightness-95"
                      sizes="(max-width: 375px) 88px, 100px"
                    />
                  </div>
                </div>

                {/* Центральная карточка */}
                <div
                  className="absolute bottom-4 left-1/2 h-32 w-22 -translate-x-1/2 transition-all duration-300 group-hover:bottom-6 group-hover:scale-105"
                  style={{ zIndex: 3, transformOrigin: "bottom center" }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={posters[2]}
                      alt="poster 1"
                      fill
                      className="rounded-lg object-cover shadow-2xl"
                      sizes="(max-width: 375px) 88px, 100px"
                      priority
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute bottom-0 left-1/2 flex h-32 w-22 -translate-x-1/2 items-center justify-center rounded-lg bg-muted shadow-xl sm:h-36 sm:w-25">
                <span className="text-3xl sm:text-4xl">🎬</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground sm:text-sm">
              {collection.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {collection.movies.length} фильмов
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
