import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

export const FilmSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full rounded-2xl overflow-hidden select-none gap-2">
      <div className="relative">
        <Skeleton className="rounded-2xl h-37.5 w-full" />
      </div>

      <div className="flex flex-col px-1 pb-1 gap-2">
        <Skeleton className="h-5 w-3/4" />
        
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  );
};