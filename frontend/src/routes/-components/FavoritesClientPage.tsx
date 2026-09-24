import type { FC } from "react";

import { CollectionWrapper } from "@/entities/collection";
import { LoadingSplashScreen, QueryErrorState } from "@/shared/components";

import { useCollections } from "@/entities/collection";

interface Props {
  pinned: string[] | string;
}

export const FavoritesClientPage: FC<Props> = ({ pinned }) => {
  const {
    data: collections,
    isLoading: isCollectionLoading,
    isError,
    error,
    refetch,
  } = useCollections(pinned);

  if (isCollectionLoading) {
    return <LoadingSplashScreen />;
  }

  if (isError) {
    return <QueryErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!collections) {
    return <LoadingSplashScreen />;
  }

  return <CollectionWrapper collections={collections} />;
};
