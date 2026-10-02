import React from "react";
import { MovieSkeleton } from "./MovieSkeleton";

interface Props {
  count: number;
}

export const MovieSkeletonWrapper: React.FC<Props> = ({ count }) => {
  return (
    <div className="grid grid-cols-3 gap-x-2.5 gap-y-[18px] sm:grid-cols-4 sm:gap-x-4">
      {Array.from({ length: count }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
};
