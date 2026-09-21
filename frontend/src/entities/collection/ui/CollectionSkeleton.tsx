import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import React, { FC } from "react";

export const CollectionSkeleton: FC = () => {
  return (
    <div className="block w-full border-1 px-1 overflow-hidden rounded-xl">
      <Card className="group relative w-full cursor-pointer overflow-visible border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="relative mx-auto mb-3 h-40 sm:h-48">
            {/* Левая карточка */}
            <div
              className="absolute bottom-2 left-1/2 h-32 w-22 -translate-x-[85%] -rotate-[10deg]"
              style={{ zIndex: 1, transformOrigin: "bottom center" }}
            >
              <Skeleton className="h-full w-full rounded-lg" />
            </div>

            {/* Правая карточка */}
            <div
              className="absolute bottom-2 left-1/2 h-32 w-22 -translate-x-[15%] rotate-[10deg]"
              style={{ zIndex: 2, transformOrigin: "bottom center" }}
            >
              <Skeleton className="h-full w-full rounded-lg" />
            </div>

            {/* Центральная карточка */}
            <div
              className="absolute bottom-4 left-1/2 h-32 w-22 -translate-x-1/2"
              style={{ zIndex: 3, transformOrigin: "bottom center" }}
            >
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
