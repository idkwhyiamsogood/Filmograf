// types
import type { FC } from "react";
import type { Collection } from "../../model/types";

// ui
import { CollectionSkeleton } from "../CollectionSkeleton";

interface Props {
  collections: Collection[]
}

export const CollectionWrapper: FC<Props> = ({ collections }) => {
  return (
    <div className="grid grid-cols-2 gap-[5px]">
      {collections.map((collection) => (
        <div></div>
      ))}
    </div>
  );
};
