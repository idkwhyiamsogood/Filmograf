import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

export const MovieSkeleton: React.FC = () => {
  return (
    <div className="block h-full">
      <article className="flex flex-col h-full w-full rounded-2xl overflow-hidden select-none gap-2">
        <div
          className="relative w-full flex-shrink-0"
          style={{ aspectRatio: "2/3" }}
        >
          <Skeleton className="rounded-2xl w-full h-full" />
        </div>

        <div className="flex flex-col px-1 pb-1 gap-1 flex-1 min-h-0">
          <Skeleton className="h-5 w-3/4" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      </article>
    </div>
  );
};
