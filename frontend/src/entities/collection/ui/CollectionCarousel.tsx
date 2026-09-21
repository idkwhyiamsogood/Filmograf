import React from "react";
import Link from "@/shared/ui/link";
import { ArrowRight } from "lucide-react";

import type { Collection } from "../model/types";
import { Button } from "@/shared/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { CollectionCover } from "./CollectionCover";
import { ColllectionFull } from "./ColllectionFull";

interface CollectionCarouselProps {
  title: string;
  collections: Collection[];
  isLoading?: boolean;
  viewAllHref?: string;
  orientation: "horizontal" | "vertical";
  type: "full" | "partial";
  onFetch?: () => void;
}

export const CollectionCarousel: React.FC<CollectionCarouselProps> = ({
  title,
  collections,
  isLoading,
  viewAllHref,
  type,
  orientation,
  onFetch,
}) => {
  const CollectionComp = type === "full" ? ColllectionFull : CollectionCover;

  console.log(collections, "collections");

  return (
    <section className="flex flex-col gap-4 py-4 px-2">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {viewAllHref && (
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href={viewAllHref}>
              <span className="hidden sm:inline text-muted-foreground">
                Все
              </span>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: collections.length > 1,
          dragThreshold: 5,
          dragFree: true,
        }}
        orientation={orientation}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading && collections.length === 0
            ? Array.from({ length: 2 }).map((_, idx) => (
                <CarouselItem
                  key={`col-skeleton-${idx}`}
                  className="pl-2 md:pl-4 basis-1/2 rounded-sm"
                >
                  <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
                </CarouselItem>
              ))
            : collections.map((collection) => (
                <CarouselItem
                  key={collection.id}
                  className="pl-2 md:pl-4 basis-1/2 rounded-sm"
                >
                  <CollectionComp collection={collection} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
