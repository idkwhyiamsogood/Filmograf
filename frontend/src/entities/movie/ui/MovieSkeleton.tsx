import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

export const MovieSkeleton: React.FC = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);
