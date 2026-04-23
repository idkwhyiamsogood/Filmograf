// types
import type { FC } from "react";
import type { Collection } from "../../model/types";

// ui
import { CollectionCover } from "../CollectionCover";

interface Props {
  collections: Collection[];
}

export const CollectionWrapper: FC<Props> = ({ collections }) => {
  return (
    <div className="grid grid-cols-2 gap-[5px]">
      {collections.map((collection, idx) => (
        <CollectionCover
          collection={collection}
          key={"collection-cover-" + String(collection.id) + idx}
        />
      ))}
    </div>
  );
};
