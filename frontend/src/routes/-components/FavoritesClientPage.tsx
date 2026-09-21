import type { FC } from "react";

import { CollectionWrapper } from "@/entities/collection";
import { LoadingSplashScreen } from "@/shared/components";

import { useCollections } from "@/entities/collection";

interface Props {
  pinned: string[] | string;
}

export const FavoritesClientPage: FC<Props> = ({ pinned }) => {
  const { data: collections, isLoading: isCollectionLoading } =
    useCollections(pinned);

  if (!collections || isCollectionLoading) {
    return <LoadingSplashScreen />;
  }

  return <CollectionWrapper collections={collections} />;
};
