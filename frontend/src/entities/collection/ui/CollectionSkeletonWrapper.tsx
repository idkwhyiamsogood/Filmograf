// types
import type { FC } from "react";

// ui
import { CollectionSkeleton } from "./CollectionSkeleton";

interface Props {
  count: number;
}

export const CollectionSkeletonWrapper: FC<Props> = ({ count }) => {
  return (
    <div className="grid grid-cols-2 gap-[5px]">
      {Array.from({ length: count }).map((_, index) => (
        <CollectionSkeleton key={index} />
      ))}
    </div>
  );
};
