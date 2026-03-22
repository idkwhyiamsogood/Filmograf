import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

interface Props {
  count: number;
}

export const CommentSkeleton: React.FC<Props> = ({ count }) => {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex gap-3" key={i}>
          <Skeleton className="size-10 flex-shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between pt-2">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-12" />
              </div>
              <div className="flex gap-5">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
