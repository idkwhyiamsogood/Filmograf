import type { FC } from "react";

import { useCollections } from "@/entities/collection";
import { useParams } from "@/shared/lib/router-compat";

import { LoadingSplashScreen, QueryErrorState } from "@/shared/components";
import { CollectionDetails } from "@/widgets/collection/";

export const CollectionClientPage: FC = () => {
  const params = useParams();

  const { data: collection, isLoading, isError, error, refetch } =
    useCollections(params.id as string);

  if (isLoading) return <LoadingSplashScreen />;

  if (isError || !collection) {
    return (
      <QueryErrorState
        error={error}
        onRetry={() => refetch()}
        notFoundMessage="Коллекция не найдена"
      />
    );
  }

  return <CollectionDetails collection={collection[0]} />;
};
