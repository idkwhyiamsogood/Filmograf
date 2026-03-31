import React from "react";
import { MovieSkeleton } from "./MovieSkeleton";

interface Props {
  count: number;
}

export const MovieSkeletonWrapper: React.FC<Props> = ({ count }) => {
  return (
    <div className="grid grid-cols-3 gap-[5px]">
      {Array.from({ length: count }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
};
